const bankLogos = import.meta.glob<{ default: string }>("./bankLogos/*.png", { eager: true });

const logos: { [key: string]: string } = {};
for (const path in bankLogos) {
  const fileName = path.replace("./bankLogos/", "").replace(".png", "").trim(); // Use trim() to avoid extra spaces
  logos[fileName] = bankLogos[path].default;
}

export default logos;