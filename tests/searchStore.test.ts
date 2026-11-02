import { describe, it, expect, beforeEach } from "vitest";
import { useSearchStore } from "../src/stores/useSearchStore";

describe("useSearchStore", () => {
  beforeEach(() => {
    useSearchStore.setState({
      isOpen: false,
      query: "",
      selectedGroup: "all",
    });
  });

  it("initializes with closed state and empty query", () => {
    const state = useSearchStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.query).toBe("");
    expect(state.selectedGroup).toBe("all");
  });

  it("opens fullscreen search with optional query", () => {
    const { openSearch } = useSearchStore.getState();
    openSearch("manzana");
    expect(useSearchStore.getState().isOpen).toBe(true);
    expect(useSearchStore.getState().query).toBe("manzana");
  });

  it("closes fullscreen search", () => {
    const { openSearch, closeSearch } = useSearchStore.getState();
    openSearch();
    expect(useSearchStore.getState().isOpen).toBe(true);

    closeSearch();
    expect(useSearchStore.getState().isOpen).toBe(false);
  });

  it("updates query and selected group", () => {
    const { setQuery, setSelectedGroup } = useSearchStore.getState();
    setQuery("avena");
    setSelectedGroup("cereales-sin-grasa");

    expect(useSearchStore.getState().query).toBe("avena");
    expect(useSearchStore.getState().selectedGroup).toBe("cereales-sin-grasa");
  });

  it("clears query and resets group", () => {
    const { setQuery, setSelectedGroup, clearQuery } = useSearchStore.getState();
    setQuery("pollo");
    setSelectedGroup("proteina-baja-grasa");

    clearQuery();
    expect(useSearchStore.getState().query).toBe("");
    expect(useSearchStore.getState().selectedGroup).toBe("all");
  });
});
