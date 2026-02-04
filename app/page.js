import Link from "next/link";
import Image from "next/image";
import menu from "@/data/menu.json";
import PhoneTestHint from "@/components/PhoneTestHint";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem 1rem", maxWidth: "600px", margin: "0 auto", minHeight: "100vh" }}>
      <div style={{
        textAlign: "center",
        marginBottom: "3rem",
        color: "#fff"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
            display: "inline-block"
          }}>
            <Image
              src="/LOGO-removebg-preview.png"
              alt="Company Logo"
              width={200}
              height={200}
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain"
              }}
              priority
            />
          </div>
        </div>
        <h1 style={{ 
          marginBottom: "0.5rem", 
          fontSize: "2.5rem", 
          fontWeight: 700,
          textShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}>
          🍽️ AR Menu
        </h1>
        <p style={{ 
          color: "rgba(255,255,255,0.9)", 
          marginBottom: "0",
          fontSize: "1.1rem",
          fontWeight: 300
        }}>
          Experience our menu in Augmented Reality
        </p>
      </div>
      
      <div style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)"
      }}>
        <p style={{ 
          color: "#667eea", 
          marginBottom: "1.5rem", 
          fontSize: "0.95rem",
          textAlign: "center",
          fontWeight: 500
        }}>
          Tap an item to view in AR. Use &quot;View in AR&quot; on your phone to place the 3D model in your space.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menu.map((item, index) => (
            <li key={item.slug} style={{ marginBottom: "1rem" }}>
              <Link
                href={`/ar/${item.slug}`}
                className="menu-link"
                style={{
                  display: "block",
                  padding: "1.5rem",
                  background: `linear-gradient(135deg, ${
                    index % 3 === 0 ? "#667eea, #764ba2" :
                    index % 3 === 1 ? "#f093fb, #f5576c" :
                    "#4facfe, #00f2fe"
                  })`,
                  borderRadius: "16px",
                  color: "#fff",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                  textDecoration: "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>{item.name}</span>
                  <span style={{ 
                    fontSize: "1.3rem", 
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.2)",
                    padding: "0.5rem 1rem",
                    borderRadius: "12px"
                  }}>
                    {item.price}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <PhoneTestHint />
    </main>
  );
}
