// src/global.d.ts
// declare module '/BankLogos' {
//     const bankLogos: { [key: string]: string };
//     export default bankLogos;
//   }
declare module '*/BankLogos' {
  const value: { [key: string]: string };
  export default value;
}