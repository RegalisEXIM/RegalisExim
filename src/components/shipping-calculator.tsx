
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Settings = {
  currency: string;
  defaultProductPrice: number;
  originCharges: number;
  freightPerTon: number;
  insurancePercent: number;
  handlingPerShipment: number;
  port: string;
};

export default function ShippingCalculator() {
  const [s, setS] = useState<Settings>({
    currency: "USD",
    defaultProductPrice: 2.4,
    originCharges: 180,
    freightPerTon: 95,
    insurancePercent: 0.35,
    handlingPerShipment: 75,
    port: "Mundra Port, India",
  });

  const [loaded, setLoaded] = useState(false);
  const [qty, setQty] = useState("10000");
  const [price, setPrice] = useState("2.4");
  const [term, setTerm] = useState("CIF");
  const [dest, setDest] = useState("");
  const [ship, setShip] = useState("FCL");
  const [pack, setPack] = useState("25 kg PP bags");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const r = await fetch("/api/public/settings");

        if (r.ok) {
          const d = await r.json();

          if (active) {
            setS(d);
            setPrice(String(d.defaultProductPrice ?? 2.4));
          }
        }
      } catch {
        // Keep the default settings if the request fails.
      } finally {
        if (active) {
          setLoaded(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const calc = useMemo(() => {
    const q = Math.max(0, Number(qty) || 0);
    const p = Math.max(0, Number(price) || 0);

    const goods = q * p;
    const freight = (q / 1000) * s.freightPerTon;
    const origin = s.originCharges + s.handlingPerShipment;

    const insurance =
      (goods + freight + origin) * (s.insurancePercent / 100);

    const total =
      term === "FOB"
        ? goods + origin
        : term === "CNF"
          ? goods + origin + freight
          : goods + origin + freight + insurance;

    return {
      goods,
      freight,
      origin,
      insurance,
      total,
      perKg: q ? total / q : 0,
    };
  }, [qty, price, term, s]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-2xl border border-[#e4e9e3] p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-[#173c30]">
          Shipment details
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label">Quantity (kg)</label>
            <input
              className="input"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">
              Product price per kg ({s.currency})
            </label>
            <input
              className="input"
              type="number"
              min="0"
              step=".01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Trade term</label>
            <select
              className="input"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option value="FOB">FOB</option>
              <option value="CNF">CNF / CFR</option>
              <option value="CIF">CIF</option>
            </select>
          </div>

          <div>
            <label className="field-label">Shipment type</label>
            <select
              className="input"
              value={ship}
              onChange={(e) => setShip(e.target.value)}
            >
              <option>FCL</option>
              <option>LCL</option>
            </select>
          </div>

          <div>
            <label className="field-label">Packaging</label>
            <select
              className="input"
              value={pack}
              onChange={(e) => setPack(e.target.value)}
            >
              <option>10 kg jute bags</option>
              <option>25 kg jute bags</option>
              <option>50 kg jute bags</option>
              <option>10 kg PP bags</option>
              <option>25 kg PP bags</option>
              <option>50 kg PP bags</option>
            </select>
          </div>

          <div>
            <label className="field-label">
              Destination country / port
            </label>
            <input
              className="input"
              placeholder="e.g. Jebel Ali, UAE"
              value={dest}
              onChange={(e) => setDest(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-[#f7f5ef] p-4 text-sm leading-6 text-[#657168]">
          Default origin: <b>{s.port}</b>. This demo uses admin-configured
          flat estimates; actual freight depends on route, carrier, season,
          container, cargo weight and local charges. LCL shipments may need
          a separate rate basis.
        </div>
      </div>

      <div className="rounded-2xl bg-[#173c30] p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e1c783]">
          Indicative estimate
        </p>

        <h2 className="mt-3 text-3xl font-black">
          {s.currency}{" "}
          {calc.total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h2>

        <p className="mt-2 text-sm text-white/65">
          Total estimate · {term === "CNF" ? "CNF/CFR" : term}
        </p>

        <div className="mt-7 space-y-4 border-t border-white/15 pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-white/70">Goods value</span>
            <span>
              {s.currency}{" "}
              {calc.goods.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-white/70">
              Origin & handling (estimate)
            </span>
            <span>
              {s.currency}{" "}
              {calc.origin.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {term !== "FOB" && (
            <div className="flex justify-between gap-4">
              <span className="text-white/70">
                Ocean freight (estimate)
              </span>
              <span>
                {s.currency}{" "}
                {calc.freight.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          )}

          {term === "CIF" && (
            <div className="flex justify-between gap-4">
              <span className="text-white/70">
                Insurance (estimate)
              </span>
              <span>
                {s.currency}{" "}
                {calc.insurance.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          )}

          <div className="flex justify-between gap-4 border-t border-white/15 pt-4 font-bold">
            <span>Estimated per kg</span>
            <span>
              {s.currency} {calc.perKg.toFixed(3)}
            </span>
          </div>
        </div>

        <Link
          href={`/contact?quantity=${encodeURIComponent(qty)}&term=${term}&destination=${encodeURIComponent(dest)}&shipment=${ship}&packaging=${encodeURIComponent(pack)}`}
          className="btn btn-gold mt-7 w-full"
        >
          Request confirmed quotation
        </Link>

        <p className="mt-4 text-xs leading-5 text-white/55">
          Excludes import duties, destination taxes and charges not listed.
          Estimates are not a binding offer. Incoterms and cost allocation
          must be confirmed for the contract.
        </p>
      </div>
    </div>
  );
}
