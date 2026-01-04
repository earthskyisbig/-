import React from 'react';

// Re-using the formatting function from ResultsDisplay.
const formatCurrency = (value: number) => {
    if (isNaN(value)) return '₩ 0';
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
    }).format(Math.round(value));
};

interface ProfitChartProps {
    totalAcquisitionCost: number;
    salePrice: number;
    afterTaxProfit: number;
}

const ChartBar: React.FC<{ label: string; value: number; percentage: number; color: string }> = ({ label, value, percentage, color }) => (
    <div className="w-full mb-4">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-secondary-text">{label}</span>
            <span className="text-sm font-bold text-primary-text">{formatCurrency(value)}</span>
        </div>
        <div className="w-full bg-input-bg rounded-full h-6 overflow-hidden">
            <div
                className={`${color} h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500 ease-out`}
                style={{ width: `${Math.max(0, percentage)}%` }}
            >
                <span className="text-xs font-bold text-black">{percentage.toFixed(1)}%</span>
            </div>
        </div>
    </div>
);

const ProfitChart: React.FC<ProfitChartProps> = ({ totalAcquisitionCost, salePrice, afterTaxProfit }) => {
    if (salePrice <= 0) {
        return null; // Don't render chart if there's no sale price
    }

    const costPercentage = (totalAcquisitionCost / salePrice) * 100;
    const profitPercentage = (afterTaxProfit / salePrice) * 100;
    const isLoss = afterTaxProfit < 0;

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6 sm:p-8">
            <h3 className="text-xl font-bold text-primary-text border-b border-border-color pb-4 mb-6">
                <i className="fa-solid fa-chart-pie text-primary mr-3"></i>
                수익 구조 분석
            </h3>
            <div className="space-y-4">
                <ChartBar
                    label="매도가"
                    value={salePrice}
                    percentage={100}
                    color="bg-primary"
                />
                <ChartBar
                    label="총 취득가액"
                    value={totalAcquisitionCost}
                    percentage={costPercentage > 100 ? 100 : costPercentage} // Cap at 100% for visual sanity
                    color="bg-red-500"
                />
                <ChartBar
                    label={isLoss ? "세후 순손실" : "세후 순수익"}
                    value={afterTaxProfit}
                    percentage={Math.abs(profitPercentage)}
                    color={isLoss ? "bg-red-400" : "bg-green-400"}
                />
            </div>
            <div className="mt-6 text-center text-sm text-secondary-text">
                <p>* 모든 비율은 매도가 대비 기준입니다.</p>
                {costPercentage > 100 && <p className="text-red-400">* 총 취득가액이 매도가를 초과합니다.</p>}
            </div>
        </div>
    );
};

export default ProfitChart;
