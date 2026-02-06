export function generateRoutine(answers) {
  var am = [
    { name: "Gentle Cleanser", reason: "Removes oil and impurities" },
    { name: "Moisturizer", reason: "Hydrates and supports the skin barrier" },
    { name: "SPF 50", reason: "Protects against UV damage" },
  ];
  var pm = [{ name: "Cleanser", reason: "Cleans off sunscreen and debris" }, 
    { name: "Moisturizer", reason: "Repairs skin overnight" },];
  if (answers.concerns.indexOf("acne") !== -1) {
    am.splice(1, 0, {name: "Niacinamide Serum", reason: "Balances oil and reduces breakouts",});
  }
  if (answers.concerns.indexOf("hyperpigmentation") !== -1 && answers.sensitivities.indexOf("retinoids") === -1) {
    pm.splice(1, 0, {name: "Retinol", reason: "Improves tone and boosts cell turnover",});
  }
  if (answers.skinType === "dry") {am.push({ name: "Facial Oil", reason: "Locks in moisture" });
}
  return { am: am, pm: pm };
}

