// ./../assets/BankLogos' or its corresponding type declarations
// 위 에러가 뜨는걸 방지하기 위해 이미지 타입들을 다 선언해줌

declare module "*.png" {
    const value: string;
    export default value;
  }
  
  declare module "*.jpg" {
    const value: string;
    export default value;
  }
  
  declare module "*.jpeg" {
    const value: string;
    export default value;
  }
  