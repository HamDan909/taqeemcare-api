/**
 * Same formula as calculateCurrentServicePrice in client/code_artifact.html.
 * Hours minimum 2, workers minimum 1, units minimum 1 — matching the calculator controls.
 */
function quoteService(sub, calc = {}) {
  const pricingMode = ['hourly', 'visit', 'weekly', 'monthly'].includes(calc.pricingMode)
    ? calc.pricingMode
    : 'visit';
  const hours = Math.max(2, Number(calc.hours) || 2);
  const workers = Math.max(1, Number(calc.workers) || 1);
  const units = Math.max(1, Number(calc.units) || 1);
  const materialSource = calc.materialSource === 'client' ? 'client' : 'company';
  const materialDuration = String(calc.materialDuration) === '2' ? '2' : '1';
  const materialTier = calc.materialTier === 'custom' ? 'custom' : 'basic';
  const customQuantities = calc.customQuantities && typeof calc.customQuantities === 'object'
    ? calc.customQuantities
    : {};

  let serviceCost = 0;
  let modeLabel = '';

  if (pricingMode === 'hourly') {
    serviceCost = sub.hourlyRate * hours * workers;
    modeLabel = `${hours} ساعات × ${workers} عمال`;
  } else {
    const extraUnits = Math.max(0, units - 1);
    const singleVisit = sub.visitBasePrice + extraUnits * sub.unitPrice;

    if (pricingMode === 'visit') {
      serviceCost = singleVisit;
      modeLabel = `زيارة واحدة (${units} ${sub.unitLabel})`;
    } else if (pricingMode === 'weekly') {
      serviceCost = Math.round(singleVisit * 4 * 0.85);
      modeLabel = 'باقة أسبوعية (4 زيارات - خصم 15%)';
    } else if (pricingMode === 'monthly') {
      serviceCost = Math.round(singleVisit * 4 * 0.75);
      modeLabel = 'باقة شهرية (خصم 25%)';
    }
  }

  let materialsCost = 0;
  let materialLabel = 'من طرف العميل';

  if (materialSource === 'company') {
    let rawMatTotal = 0;
    (sub.materialsKit || []).forEach((mat) => {
      const rawQty = materialTier === 'basic'
        ? mat.defaultQty
        : (customQuantities[mat.id] ?? mat.defaultQty);
      const qty = Math.max(0, Number(rawQty) || 0);
      rawMatTotal += qty * mat.price;
    });

    const durationMultiplier = parseInt(materialDuration, 10);
    rawMatTotal *= durationMultiplier;

    if (durationMultiplier === 2) {
      materialsCost = Math.round(rawMatTotal * 0.9);
      materialLabel = 'من الشركة (تكفي زيارتين - خصم 10%)';
    } else {
      materialsCost = rawMatTotal;
      materialLabel = 'من الشركة (تكفي زيارة واحدة)';
    }
  }

  const specialMaterials = Array.isArray(calc.specialMaterials)
    ? calc.specialMaterials
      .filter((item) => item && String(item.name || '').trim())
      .map((item) => ({
        name: String(item.name).trim(),
        qty: String(item.qty || '1 عبوة').trim(),
      }))
    : [];

  return {
    serviceCost,
    materialsCost,
    totalCost: serviceCost + materialsCost,
    modeLabel,
    materialLabel,
    hasUnpricedItems: specialMaterials.length > 0,
    specialMaterials,
    pricingMode,
    hours,
    workers,
    units,
    materialSource,
    materialDuration,
    materialTier,
    customQuantities,
  };
}

module.exports = { quoteService };
