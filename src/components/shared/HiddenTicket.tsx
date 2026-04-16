import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

type HiddenTicketProps = {
  childName: string;
  childClass: string;
  seats: string[];
  regId: string;
  baseUrl: string;
};

export const HiddenTicket = forwardRef<HTMLDivElement, HiddenTicketProps>(
  ({ childName, childClass, seats, regId, baseUrl }, ref) => {
    return (
      <div className="absolute -z-50 opacity-0 pointer-events-none top-0 left-0">
        <div
          ref={ref}
          style={{ width: "600px", padding: "20px", fontFamily: "sans-serif" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              border: "4px solid #5d4037",
            }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Background.png"
              alt="Ticket Background"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            />
            <div
              style={{
                flex: 1,
                padding: "40px",
                position: "relative",
                zIndex: 10,
                borderRight: "3px dashed #5d4037",
              }}>
              <div style={{ position: "relative", zIndex: 1 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "#5d4037",
                    letterSpacing: "4px",
                    marginBottom: "10px",
                    textShadow: "1px 1px 0 #fff",
                  }}>
                  GOLDEN TICKET
                </p>
                <h1
                  style={{
                    fontSize: "42px",
                    fontWeight: 900,
                    color: "#3e2723",
                    lineHeight: 1,
                    margin: "0 0 40px 0",
                    textShadow: "2px 2px 0px rgba(255,255,255,0.8)",
                  }}>
                  PENTAS SENI
                  <br />
                  2026
                </h1>
                <div style={{ marginBottom: "30px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#8d6e63",
                      textTransform: "uppercase",
                      marginBottom: "5px",
                      textShadow: "1px 1px 0 #fff",
                    }}>
                    Guest Name
                  </p>
                  <p
                    style={{
                      fontSize: "32px",
                      fontWeight: 900,
                      color: "#3e2723",
                      textTransform: "capitalize",
                      textShadow: "1px 1px 0 #fff",
                    }}>
                    {childName}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "40px" }}>
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8d6e63",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 0 #fff",
                      }}>
                      Class
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: 900,
                        color: "#3e2723",
                        textShadow: "1px 1px 0 #fff",
                      }}>
                      {childClass}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8d6e63",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 0 #fff",
                      }}>
                      Hall
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: 900,
                        color: "#3e2723",
                        textShadow: "1px 1px 0 #fff",
                      }}>
                      AUDITORIUM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "200px",
                background: "#5d4037",
                padding: "40px 20px",
                color: "#efebe9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                borderLeft: "3px dashed #8d6e63",
                position: "relative",
                zIndex: 10,
              }}>
              <div style={{ textAlign: "center", width: "100%" }}>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    marginBottom: "10px",
                    color: "#d7ccc8",
                  }}>
                  SEAT NO.
                </p>
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: 900,
                    lineHeight: 1.1,
                    margin: 0,
                    color: "#ffffff",
                  }}>
                  {seats.join("/")}
                </h2>
              </div>
              <div
                style={{
                  background: "#fff8e1",
                  padding: "10px",
                  borderRadius: "16px",
                }}>
                {regId && baseUrl && (
                  <QRCodeSVG
                    value={`${baseUrl}/ticket?id=${regId}`}
                    size={100}
                    level={"H"}
                    fgColor="#3e2723"
                    bgColor="#fff8e1"
                  />
                )}
              </div>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  opacity: 0.8,
                  textAlign: "center",
                  color: "#d7ccc8",
                }}>
                TK AISYIYAH 21
                <br />
                RAWAMANGUN
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
HiddenTicket.displayName = "HiddenTicket";
