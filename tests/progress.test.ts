import { describe, it, expect, beforeEach } from "vitest";
import {
  computeBMI,
  FASTING_PROTOCOLS,
  useProgressStore,
} from "../src/stores/useProgressStore";

describe("Progress & Biometrics Unit Tests", () => {
  beforeEach(() => {
    useProgressStore.setState({
      currentWeight: 68.0,
      targetWeight: 65.0,
      initialWeight: 70.0,
      heightCm: 168,
      waterIntake: 1250,
      waterTarget: 2000,
      isFasting: false,
      fastingProtocol: "16-8",
    });
  });

  describe("computeBMI", () => {
    it("classifies underweight (< 18.5)", () => {
      const res = computeBMI(45, 170); // ~15.6
      expect(res.category).toBe("Bajo peso");
      expect(res.bmi).toBe(15.6);
    });

    it("classifies normal weight (18.5 - 24.9)", () => {
      const res = computeBMI(65, 170); // ~22.5
      expect(res.category).toBe("Peso normal");
      expect(res.bmi).toBe(22.5);
    });

    it("classifies overweight (25.0 - 29.9)", () => {
      const res = computeBMI(78, 170); // ~27.0
      expect(res.category).toBe("Sobrepeso");
      expect(res.bmi).toBe(27.0);
    });

    it("classifies obesity (>= 30.0)", () => {
      const res = computeBMI(95, 170); // ~32.9
      expect(res.category).toBe("Obesidad");
      expect(res.bmi).toBe(32.9);
    });

    it("handles zero or negative inputs gracefully", () => {
      const res = computeBMI(0, 0);
      expect(res.bmi).toBe(0);
      expect(res.category).toBe("Peso normal");
    });
  });

  describe("FASTING_PROTOCOLS", () => {
    it("defines 16:8 protocol with 16 fasting and 8 eating hours", () => {
      expect(FASTING_PROTOCOLS["16-8"].fastingHours).toBe(16);
      expect(FASTING_PROTOCOLS["16-8"].eatingHours).toBe(8);
    });

    it("defines 14:10 protocol with 14 fasting and 10 eating hours", () => {
      expect(FASTING_PROTOCOLS["14-10"].fastingHours).toBe(14);
      expect(FASTING_PROTOCOLS["14-10"].eatingHours).toBe(10);
    });

    it("defines 12:12 protocol with equal balance", () => {
      expect(FASTING_PROTOCOLS["12-12"].fastingHours).toBe(12);
      expect(FASTING_PROTOCOLS["12-12"].eatingHours).toBe(12);
    });

    it("defines 18:6 protocol for advanced users", () => {
      expect(FASTING_PROTOCOLS["18-6"].fastingHours).toBe(18);
      expect(FASTING_PROTOCOLS["18-6"].eatingHours).toBe(6);
    });
  });

  describe("Water Hydration Tracking in store", () => {
    it("adds water increments accurately", async () => {
      const { addWater } = useProgressStore.getState();
      await addWater(250);
      expect(useProgressStore.getState().waterIntake).toBe(1500);

      await addWater(500);
      expect(useProgressStore.getState().waterIntake).toBe(2000);
    });

    it("resets water intake to zero", async () => {
      const { resetWater } = useProgressStore.getState();
      await resetWater();
      expect(useProgressStore.getState().waterIntake).toBe(0);
    });
  });

  describe("Fasting timer control in store", () => {
    it("starts fasting and records protocol", () => {
      const { startFasting } = useProgressStore.getState();
      startFasting("14-10");
      const state = useProgressStore.getState();
      expect(state.isFasting).toBe(true);
      expect(state.fastingProtocol).toBe("14-10");
      expect(state.fastingStartTime).not.toBeNull();
    });

    it("stops fasting", () => {
      const { startFasting, stopFasting } = useProgressStore.getState();
      startFasting("16-8");
      stopFasting();
      const state = useProgressStore.getState();
      expect(state.isFasting).toBe(false);
      expect(state.fastingStartTime).toBeNull();
    });
  });

  describe("Weight and target logging", () => {
    it("updates current weight and appends log", async () => {
      const { logWeight } = useProgressStore.getState();
      await logWeight(67.5, "2026-11-03", "Pesaje matutino", { waist: 71 });
      const state = useProgressStore.getState();
      expect(state.currentWeight).toBe(67.5);
      expect(state.logs[0].weight).toBe(67.5);
      expect(state.logs[0].notes).toBe("Pesaje matutino");
      expect(state.logs[0].waist).toBe(71);
    });

    it("updates height and target weight", () => {
      const { setTargetWeight, setHeightCm } = useProgressStore.getState();
      setTargetWeight(63.0);
      setHeightCm(172);
      expect(useProgressStore.getState().targetWeight).toBe(63.0);
      expect(useProgressStore.getState().heightCm).toBe(172);
    });
  });
});
