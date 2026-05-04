import { useState, useEffect } from "react";

const DEFAULT_CARS = [
  { id: 1, name: "Suzuki Alto", avg: 22, icon: "🚗" },
  { id: 2, name: "Honda Civic", avg: 12, icon: "🚙" },
  { id: 3, name: "Toyota Corolla", avg: 14, icon: "🚘" },
  { id: 4, name: "Suzuki Mehran", avg: 18, icon: "🚕" },
];

const FUEL_PRICE = 278; // PKR per litre (current petrol price Pakistan)

function formatPKR(amount) {
  return "Rs. " + Math.round(amount).toLocaleString("en-PK");
}

export default function App() {
  const [cars, setCars] = useState(() => {
    try {
      const saved = localStorage.getItem("indrive_cars");
      return saved ? JSON.parse(saved) : DEFAULT_CARS;
    } catch {
      return DEFAULT_CARS;
    }
  });
  const [selectedCar, setSelectedCar] = useState(null);
  const [distance, setDistance] = useState("");
  const [fare, setFare] = useState("");
  const [fuelPrice, setFuelPrice] = useState(FUEL_PRICE);
  const [result, setResult] = useState(null);
  const [screen, setScreen] = useState("home"); // home | calculate | manage | addCar
  const [newCar, setNewCar] = useState({ name: "", avg: "", icon: "🚗" });
  const [editingId, setEditingId] = useState(null);
  const [animResult, setAnimResult] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("indrive_cars", JSON.stringify(cars));
    } catch {}
  }, [cars]);

  useEffect(() => {
    if (cars.length > 0 && !selectedCar) {
      setSelectedCar(cars[0]);
    }
  }, [cars]);

  function calculate() {
    if (!selectedCar || !distance || !fare) return;
    const dist = parseFloat(distance);
    const fareAmt = parseFloat(fare);
    const litresUsed = dist / selectedCar.avg;
    const fuelCost = litresUsed * fuelPrice;
    const profit = fareAmt - fuelCost;
    const profitPercent = ((profit / fareAmt) * 100).toFixed(1);
    setResult({ dist, fareAmt, litresUsed, fuelCost, profit, profitPercent });
    setAnimResult(false);
    setTimeout(() => setAnimResult(true), 50);
  }

  function addCar() {
    if (!newCar.name || !newCar.avg) return;
    if (editingId !== null) {
      setCars(cars.map(c => c.id === editingId ? { ...c, name: newCar.name, avg: parseFloat(newCar.avg), icon: newCar.icon } : c));
      setEditingId(null);
    } else {
      const id = Date.now();
      setCars([...cars, { id, name: newCar.name, avg: parseFloat(newCar.avg), icon: newCar.icon }]);
    }
    setNewCar({ name: "", avg: "", icon: "🚗" });
    setScreen("manage");
  }

  function deleteCar(id) {
    setCars(cars.filter(c => c.id !== id));
    if (selectedCar?.id === id) setSelectedCar(cars[0] || null);
  }

  function startEdit(car) {
    setNewCar({ name: car.name, avg: String(car.avg), icon: car.icon });
    setEditingId(car.id);
    setScreen("addCar");
  }

  const icons = ["🚗", "🚙", "🚕", "🚘", "🏎️", "🚐", "🛻"];

  const profitColor = result
    ? result.profit > 0
      ? "#00e676"
      : "#ff1744"
    : "#00e676";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0d1b2a 50%, #0a0a0f 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#e8eaf6",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "fixed", top: "-100px", right: "-100px",
        width: "400px", height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-150px", left: "-100px",
        width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(33,150,243,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 0 80px 0", position: "relative" }}>

        {/* Header */}
        <div style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {screen !== "home" && (
            <button onClick={() => { setScreen("home"); setResult(null); }}
              style={{ background: "none", border: "none", color: "#00e676", fontSize: 22, cursor: "pointer", padding: 0 }}>
              ←
            </button>
          )}
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#00e676", fontWeight: 700, textTransform: "uppercase" }}>
              InDrive
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
              {screen === "home" ? "Profit Calculator" :
               screen === "calculate" ? "Trip Calculator" :
               screen === "manage" ? "Meri Gaadiyan" : 
               editingId ? "Gaadi Edit Karein" : "Nayi Gaadi Add Karein"}
            </div>
          </div>
        </div>

        {/* HOME SCREEN */}
        {screen === "home" && (
          <div style={{ padding: "24px" }}>
            {/* Quick Stats */}
            {selectedCar && (
              <div style={{
                background: "linear-gradient(135deg, rgba(0,230,118,0.12), rgba(0,230,118,0.04))",
                border: "1px solid rgba(0,230,118,0.2)",
                borderRadius: 16, padding: "18px 20px", marginBottom: 24,
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 36 }}>{selectedCar.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 2 }}>Active Gaadi</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedCar.name}</div>
                  <div style={{ fontSize: 12, color: "#00e676" }}>Average: {selectedCar.avg} km/litre</div>
                </div>
              </div>
            )}

            {/* Main Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button onClick={() => setScreen("calculate")}
                style={{
                  background: "linear-gradient(135deg, #00e676, #00c853)",
                  border: "none", borderRadius: 14, padding: "18px 24px",
                  color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer",
                  textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                  boxShadow: "0 4px 20px rgba(0,230,118,0.3)",
                }}>
                <span style={{ fontSize: 28 }}>📍</span>
                <div>
                  <div>Trip Calculate Karein</div>
                  <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.7 }}>Fuel cost aur profit janein</div>
                </div>
              </button>

              <button onClick={() => setScreen("manage")}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14, padding: "18px 24px",
                  color: "#e8eaf6", fontSize: 16, fontWeight: 700, cursor: "pointer",
                  textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                }}>
                <span style={{ fontSize: 28 }}>🚗</span>
                <div>
                  <div>Gaadiyan Manage Karein</div>
                  <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.5 }}>{cars.length} gaadi{cars.length !== 1 ? "yan" : ""} saved hain</div>
                </div>
              </button>
            </div>

            {/* Fuel Price Setting */}
            <div style={{
              marginTop: 24,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "16px 20px",
            }}>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>⛽ Petrol Price (per litre)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#00e676", fontWeight: 700 }}>Rs.</span>
                <input
                  type="number"
                  value={fuelPrice}
                  onChange={e => setFuelPrice(parseFloat(e.target.value) || 0)}
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8, padding: "8px 12px", color: "#fff",
                    fontSize: 18, fontWeight: 700, width: "100px",
                  }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>aaj ka rate set karein</span>
              </div>
            </div>
          </div>
        )}

        {/* CALCULATE SCREEN */}
        {screen === "calculate" && (
          <div style={{ padding: "24px" }}>
            {/* Car Selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>
                Gaadi Select Karein
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {cars.map(car => (
                  <button key={car.id}
                    onClick={() => { setSelectedCar(car); setResult(null); }}
                    style={{
                      background: selectedCar?.id === car.id
                        ? "linear-gradient(135deg, #00e676, #00c853)"
                        : "rgba(255,255,255,0.05)",
                      border: selectedCar?.id === car.id
                        ? "none"
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, padding: "8px 14px",
                      color: selectedCar?.id === car.id ? "#000" : "#ccc",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                      transition: "all 0.2s",
                    }}>
                    {car.icon} {car.name}
                  </button>
                ))}
              </div>
              {selectedCar && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#00e676" }}>
                  ✓ Average: {selectedCar.avg} km/litre
                </div>
              )}
            </div>

            {/* Distance Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                📍 Total Distance (km)
              </label>
              <input
                type="number"
                placeholder="Jaise: 15"
                value={distance}
                onChange={e => { setDistance(e.target.value); setResult(null); }}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: "14px 16px",
                  color: "#fff", fontSize: 18, fontWeight: 600,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            {/* Fare Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                💰 Customer ka Fare (Rs.)
              </label>
              <input
                type="number"
                placeholder="Jaise: 500"
                value={fare}
                onChange={e => { setFare(e.target.value); setResult(null); }}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: "14px 16px",
                  color: "#fff", fontSize: 18, fontWeight: 600,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ fontSize: 11, color: "#555", marginBottom: 16 }}>
              ⛽ Petrol rate: Rs. {fuelPrice}/litre
            </div>

            {/* Calculate Button */}
            <button onClick={calculate}
              disabled={!selectedCar || !distance || !fare}
              style={{
                width: "100%",
                background: (!selectedCar || !distance || !fare)
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, #00e676, #00c853)",
                border: "none", borderRadius: 14, padding: "16px",
                color: (!selectedCar || !distance || !fare) ? "#555" : "#000",
                fontSize: 16, fontWeight: 800, cursor: (!selectedCar || !distance || !fare) ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: (!selectedCar || !distance || !fare) ? "none" : "0 4px 20px rgba(0,230,118,0.3)",
              }}>
              Calculate Karein 🔢
            </button>

            {/* Result */}
            {result && (
              <div style={{
                marginTop: 24,
                opacity: animResult ? 1 : 0,
                transform: animResult ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                {/* Profit Banner */}
                <div style={{
                  background: result.profit > 0
                    ? "linear-gradient(135deg, rgba(0,230,118,0.15), rgba(0,200,83,0.08))"
                    : "linear-gradient(135deg, rgba(255,23,68,0.15), rgba(200,0,30,0.08))",
                  border: `1px solid ${result.profit > 0 ? "rgba(0,230,118,0.3)" : "rgba(255,23,68,0.3)"}`,
                  borderRadius: 16, padding: "20px",
                  textAlign: "center", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 13, color: "#aaa", marginBottom: 6 }}>
                    {result.profit > 0 ? "🎉 Aapka Profit" : "😬 Nuksan"}
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: profitColor, letterSpacing: -1 }}>
                    {formatPKR(Math.abs(result.profit))}
                  </div>
                  <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>
                    ({result.profitPercent}% fare ka)
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, overflow: "hidden",
                }}>
                  {[
                    { label: "📏 Distance", value: `${result.dist} km` },
                    { label: "⛽ Fuel Used", value: `${result.litresUsed.toFixed(2)} litre` },
                    { label: "💸 Fuel Cost", value: formatPKR(result.fuelCost), highlight: true, bad: true },
                    { label: "🤝 Customer Fare", value: formatPKR(result.fareAmt) },
                    { label: result.profit > 0 ? "✅ Net Profit" : "❌ Net Loss", value: formatPKR(Math.abs(result.profit)), highlight: true, good: result.profit > 0 },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 18px",
                      borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      background: row.highlight ? "rgba(255,255,255,0.02)" : "transparent",
                    }}>
                      <span style={{ fontSize: 13, color: "#aaa" }}>{row.label}</span>
                      <span style={{
                        fontSize: row.highlight ? 16 : 14,
                        fontWeight: row.highlight ? 800 : 600,
                        color: row.good ? "#00e676" : row.bad ? "#ff6b6b" : "#e8eaf6",
                      }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Advice */}
                <div style={{
                  marginTop: 12,
                  padding: "12px 16px",
                  background: result.profit > 0 ? "rgba(0,230,118,0.06)" : "rgba(255,23,68,0.06)",
                  borderRadius: 10,
                  fontSize: 13, color: "#aaa", lineHeight: 1.5,
                }}>
                  {result.profit > 0
                    ? result.profitPercent > 50
                      ? "💪 Zabardast trip hai! Bahut acha margin hai."
                      : "👍 Trip theek hai, qabil qabool hai."
                    : "⚠️ Ye trip ghaate wali hai. Fare kam hai ya distance zyada."}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANAGE SCREEN */}
        {screen === "manage" && (
          <div style={{ padding: "24px" }}>
            <button onClick={() => { setNewCar({ name: "", avg: "", icon: "🚗" }); setEditingId(null); setScreen("addCar"); }}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #00e676, #00c853)",
                border: "none", borderRadius: 14, padding: "14px",
                color: "#000", fontSize: 15, fontWeight: 800, cursor: "pointer",
                marginBottom: 20,
                boxShadow: "0 4px 20px rgba(0,230,118,0.25)",
              }}>
              + Nayi Gaadi Add Karein
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cars.map(car => (
                <div key={car.id} style={{
                  background: selectedCar?.id === car.id
                    ? "linear-gradient(135deg, rgba(0,230,118,0.1), rgba(0,230,118,0.04))"
                    : "rgba(255,255,255,0.03)",
                  border: selectedCar?.id === car.id
                    ? "1px solid rgba(0,230,118,0.25)"
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 30 }}>{car.icon}</span>
                  <div style={{ flex: 1 }} onClick={() => { setSelectedCar(car); }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{car.name}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>Average: {car.avg} km/litre</div>
                    {selectedCar?.id === car.id && (
                      <div style={{ fontSize: 11, color: "#00e676", marginTop: 2 }}>✓ Selected</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(car)}
                      style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#aaa", cursor: "pointer", fontSize: 14 }}>
                      ✏️
                    </button>
                    <button onClick={() => deleteCar(car.id)}
                      style={{ background: "rgba(255,23,68,0.1)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#ff6b6b", cursor: "pointer", fontSize: 14 }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cars.length === 0 && (
              <div style={{ textAlign: "center", color: "#555", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
                <div>Koi gaadi nahi. Pehli gaadi add karein!</div>
              </div>
            )}
          </div>
        )}

        {/* ADD CAR SCREEN */}
        {screen === "addCar" && (
          <div style={{ padding: "24px" }}>
            {/* Icon Picker */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>
                Icon Chunein
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {icons.map(icon => (
                  <button key={icon}
                    onClick={() => setNewCar({ ...newCar, icon })}
                    style={{
                      background: newCar.icon === icon ? "rgba(0,230,118,0.2)" : "rgba(255,255,255,0.05)",
                      border: newCar.icon === icon ? "2px solid #00e676" : "2px solid transparent",
                      borderRadius: 10, padding: "8px 12px", fontSize: 24, cursor: "pointer",
                    }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                Gaadi ka Naam
              </label>
              <input
                type="text"
                placeholder="Jaise: Suzuki Alto"
                value={newCar.name}
                onChange={e => setNewCar({ ...newCar, name: e.target.value })}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: "14px 16px",
                  color: "#fff", fontSize: 16, fontWeight: 600,
                  boxSizing: "border-box", outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                Fuel Average (km per litre)
              </label>
              <input
                type="number"
                placeholder="Jaise: 22"
                value={newCar.avg}
                onChange={e => setNewCar({ ...newCar, avg: e.target.value })}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: "14px 16px",
                  color: "#fff", fontSize: 16, fontWeight: 600,
                  boxSizing: "border-box", outline: "none",
                }}
              />
            </div>

            <button onClick={addCar}
              disabled={!newCar.name || !newCar.avg}
              style={{
                width: "100%",
                background: (!newCar.name || !newCar.avg) ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #00e676, #00c853)",
                border: "none", borderRadius: 14, padding: "16px",
                color: (!newCar.name || !newCar.avg) ? "#555" : "#000",
                fontSize: 16, fontWeight: 800, cursor: (!newCar.name || !newCar.avg) ? "not-allowed" : "pointer",
                boxShadow: (!newCar.name || !newCar.avg) ? "none" : "0 4px 20px rgba(0,230,118,0.3)",
              }}>
              {editingId ? "✓ Update Karein" : "+ Add Karein"}
            </button>
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      {(screen === "home" || screen === "calculate" || screen === "manage") && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: "rgba(10,10,15,0.95)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", backdropFilter: "blur(20px)",
        }}>
          {[
            { id: "home", label: "Home", icon: "🏠" },
            { id: "calculate", label: "Calculate", icon: "📍" },
            { id: "manage", label: "Gaadiyan", icon: "🚗" },
          ].map(tab => (
            <button key={tab.id}
              onClick={() => { setScreen(tab.id); setResult(null); }}
              style={{
                flex: 1, background: "none", border: "none",
                padding: "12px 0",
                color: screen === tab.id ? "#00e676" : "#555",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4, transition: "color 0.2s",
              }}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
