import mixpanel, { Dict } from "mixpanel-browser";

export const track = (str: string, properties?: Dict) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "prod") return;

  mixpanel.track(str, properties);
};
