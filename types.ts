export interface InputData {
    appraisedValue: number;
    bidRate: number;
    salePrice: number;
    loanRatio?: number;
    interiorCosts?: number;
    evictionCosts?: number;
    overdueFees?: number;
    buildingVat?: number;
    takeoverCosts?: number;
    caseNumber?: string;
    address?: string;
    landArea?: string;
    buildingArea?: string;
    yearBuilt?: string;
}

export interface CalculationResult {
    winningBidPrice: number;
    loanableAmount: number;
    acquisitionTax: number;
    legalFees: number;
    brokerageFee: number;
    totalAcquisitionCost: number;
    requiredCapital: number;
    interest: number;
    prepaymentPenalty: number;
    preTaxProfit: number;
    taxAmount: number;
    afterTaxProfit: number;
    returnOnInvestment: number;
    interiorCosts: number;
    evictionCosts: number;
    overdueFees: number;
    buildingVat: number;
    takeoverCosts: number;
}