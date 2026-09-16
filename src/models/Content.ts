import type { Component } from "vue";

export type Content = {
  main: Component;
  props?: Record<string, unknown> | undefined;
};
