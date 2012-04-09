#include <EtherCard.h>
#include <aJSON.h>

// ethernet interface mac address, must be unique on the LAN
static byte mymac[] = { 0x74,0x69,0x69,0x2D,0x30,0x31 };
static byte myip[] = { 192,168,0,203 };

byte Ethernet::buffer[300];
BufferFiller bfill;

char okHeader[] PROGMEM = 
    "HTTP/1.1 200 OK\r\n"
    "content-type:application/js;\r\n"
    "\r\n"
;

byte ra, rb, rc, rd, fe, ff, t;
int fr, fg, fb;


void setup () {
  Serial.begin(9600);
  pinMode(10, OUTPUT);  
  digitalWrite(10,HIGH);
  if (ether.begin(sizeof Ethernet::buffer, mymac), 10 == 0)
    Serial.println( "Failed Ethernet");
  ether.staticSetup(myip);
  Serial.println("init done."); 
  
  pinMode(3,OUTPUT);
  pinMode(4,OUTPUT);
  pinMode(6,OUTPUT);
  pinMode(8,OUTPUT);
  pinMode(9,OUTPUT);
  pinMode(A0,OUTPUT);
  pinMode(A1,OUTPUT);
  pinMode(A2,OUTPUT);
  pinMode(A3,OUTPUT);
  
  ra = 0;
  rb = 0;
  rc = 0;
  rd = 0;
  fe = 0;
  ff = 0;
  t  = 0;
  fr = 0;
  fg = 0;
  fb = 0;
}

static int getIntArg(const char* data, const char* key, int value =-1) {
    char temp[10];
    if (ether.findKeyVal(data + 7, temp, sizeof temp, key) > 0)
        value = atoi(temp);
    return value;	
}

void loop () {
  word len = ether.packetReceive();
  word pos = ether.packetLoop(len);
  
  if (pos) { 
     bfill = ether.tcpOffset();
        char* data = (char *) Ethernet::buffer + pos;
        Serial.println(data);
        delay(10);
        if (strncmp("GET /i", data, 6) == 0){
          
           aJsonObject* root = aJson.createObject();
          aJson.addNumberToObject(root, "relaisCpu", ra);
          aJson.addNumberToObject(root, "relaisVer", rb);
          aJson.addNumberToObject(root, "relaisK", rc);
          aJson.addNumberToObject(root, "relaisT", rd);
          aJson.addNumberToObject(root, "fetK", fe);
          aJson.addNumberToObject(root, "fetT", ff);
          aJson.addNumberToObject(root, "totaal", t);
          aJson.addNumberToObject(root, "fetRood", fr);
          aJson.addNumberToObject(root, "fetGroen", fg);
          aJson.addNumberToObject(root, "fetBlauw", fb);
          char* json =aJson.print(root);
          
          
          delay(20); 
          bfill.emit_p(PSTR(
            "$F"
            "callback("
            "$S"
            ");"
            ),okHeader,json);
            
        }
        else if (strncmp("GET /s", data, 6) == 0){
          if(data[6] == '?'){
            ra = getIntArg(data, "a");
            rb = getIntArg(data, "b");
            rc = getIntArg(data, "c");
            rd = getIntArg(data, "d");
            fe = getIntArg(data, "e");
            ff = getIntArg(data, "f");
            t =  getIntArg(data, "j");
            fr = getIntArg(data, "g");
            fg = getIntArg(data, "h");
            fb = getIntArg(data, "i");

            analogWrite(3,fr);
            analogWrite(9,fb);
            analogWrite(6,fg);
            
            switch (ra) {
              case 0:
                digitalWrite(8,LOW);
                break;
              case 1:
                digitalWrite(8,HIGH);
                break;
            }
            switch (rb) {
              case 0:
                digitalWrite(4,LOW);
                break;
              case 1:
                digitalWrite(4,HIGH);
                break;
            }
             switch (rc) {
              case 0:
                digitalWrite(A0,LOW);
                break;
              case 1:
                digitalWrite(A0,HIGH);
                break;
            }
             switch (rd) {
              case 0:
                digitalWrite(A1,LOW);
                break;
              case 1:
                digitalWrite(A1,HIGH);
                break;
            }
            switch (fe) {
              case 0:
                digitalWrite(A2,LOW);
                break;
              case 1:
                digitalWrite(A2,HIGH);
                break;
            }
            switch (ff) {
              case 0:
                digitalWrite(A3,LOW);
                break;
              case 1:
                digitalWrite(A3,HIGH);
                break;
            }
            switch (t) {
            case 0:
              delay(50000);
                digitalWrite(8,LOW);
                digitalWrite(4,LOW);
                digitalWrite(A0,LOW);
                digitalWrite(A1,LOW);
              break;
            case 1:
              break;
            }
          }

          
          aJsonObject* root = aJson.createObject();
          aJson.addNumberToObject(root, "relaisCpu", ra);
          aJson.addNumberToObject(root, "relaisVer", rb);
          aJson.addNumberToObject(root, "relaisK", rc);
          aJson.addNumberToObject(root, "relaisT", rd);
          aJson.addNumberToObject(root, "fetK", fe);
          aJson.addNumberToObject(root, "fetT", ff);
          aJson.addNumberToObject(root, "totaal", t);
          aJson.addNumberToObject(root, "fetRood", fr);
          aJson.addNumberToObject(root, "fetGroen", fg);
          aJson.addNumberToObject(root, "fetBlauw", fb);
          char* json =aJson.print(root);
          
          delay(20); 
          bfill.emit_p(PSTR(
            "$F"
            "callback("
            "$S"
            ");"
            ),okHeader,json);
        }
        else
            bfill.emit_p(PSTR(
                "HTTP/1.0 401 Unauthorized\r\n"
                "Content-Type: text/html\r\n"
                "\r\n"
                "<h1>401 Unauthorized</h1>"));
        delay(20); 
        ether.httpServerReply(bfill.position()); // send web page data
  }
}
