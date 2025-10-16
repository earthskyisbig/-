import type { InputData, CalculationResult } from '../types';

const calculateProgressiveTax = (income: number): number => {
    if (income <= 0) return 0;
    if (income <= 14000000) return income * 0.06;
    if (income <= 50000000) return income * 0.15 - 1260000;
    if (income <= 88000000) return income * 0.24 - 5760000;
    if (income <= 150000000) return income * 0.35 - 15360000;
    if (income <= 300000000) return income * 0.38 - 19260000;
    if (income <= 500000000) return income * 0.40 - 25260000;
    if (income <= 1000000000) return income * 0.42 - 35260000;
    return income * 0.45 - 65260000;
};

export const calculateProfitability = (inputs: InputData): CalculationResult => {
    const {
        appraisedValue: appraisedValueMillion,
        bidRate,
        salePrice: salePriceMillion,
        loanRatio = 80, // Default to 80% if not provided
        interiorCosts: interiorCostsMillion = 0,
        evictionCosts: evictionCostsMillion = 0,
        overdueFees: overdueFeesMillion = 0,
        buildingVat: buildingVatMillion = 0,
        takeoverCosts: takeoverCostsMillion = 0
    } = inputs;

    const multiplier = 1000000;
    const appraisedValue = appraisedValueMillion * multiplier;
    const salePrice = salePriceMillion * multiplier;
    const interiorCosts = interiorCostsMillion * multiplier;
    const evictionCosts = evictionCostsMillion * multiplier;
    const overdueFees = overdueFeesMillion * multiplier;
    const buildingVat = buildingVatMillion * multiplier;
    const takeoverCosts = takeoverCostsMillion * multiplier;

    const winningBidPrice = appraisedValue * (bidRate / 100);
    const loanableAmount = winningBidPrice * (loanRatio / 100);
    const acquisitionTax = winningBidPrice * 0.011;
    const legalFees = winningBidPrice * 0.004;
    const brokerageFee = salePrice * 0.004;

    const totalAcquisitionCost =
        winningBidPrice +
        acquisitionTax +
        legalFees +
        evictionCosts +
        overdueFees +
        interiorCosts +
        brokerageFee +
        buildingVat +
        takeoverCosts;
    
    const requiredCapital = totalAcquisitionCost - loanableAmount;
    const interest = (loanableAmount * 0.05) / 2; // 6개월치 이자 적용
    const prepaymentPenalty = loanableAmount * 0.005;

    const preTaxProfit = salePrice - totalAcquisitionCost - interest - prepaymentPenalty;
    const taxAmount = calculateProgressiveTax(preTaxProfit);
    const afterTaxProfit = preTaxProfit - taxAmount;

    const returnOnInvestment = requiredCapital > 0 ? afterTaxProfit / requiredCapital : 0;

    return {
        winningBidPrice,
        loanableAmount,
        acquisitionTax,
        legalFees,
        brokerageFee,
        totalAcquisitionCost,
        requiredCapital,
        interest,
        prepaymentPenalty,
        preTaxProfit,
        taxAmount,
        afterTaxProfit,
        returnOnInvestment,
        interiorCosts,
        evictionCosts,
        overdueFees,
        buildingVat,
        takeoverCosts,
    };
};