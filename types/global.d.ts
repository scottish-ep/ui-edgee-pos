declare module "*.module.css" {
  const content: { [className: string]: string };
  export = content;
}

declare global {
  interface Window { // ⚠️ notice that "Window" is capitalized here
  loggedInUser: string;
  alertSuccess: any;
  alertDanger: any;
}
}