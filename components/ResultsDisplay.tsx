import React from 'react';
import type { CalculationResult } from '../types';

interface ResultsDisplayProps {
    results: CalculationResult | null;
}

const formatCurrency = (value: number) => {
    if (isNaN(value)) return '₩ 0';
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
    }).format(Math.round(value));
};

const formatPercentage = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0.00 %';
    return new Intl.NumberFormat('ko-KR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const StatCard: React.FC<{ title: string; value: string; icon: string; isPositive?: boolean; isNegative?: boolean }> = ({ title, value, icon, isPositive, isNegative }) => {
    const valueColor = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-primary';
    return (
        <div className="bg-surface p-6 rounded-xl shadow-lg flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200">
            <div className={`text-3xl ${valueColor}`}>
                <i className={icon}></i>
            </div>
            <div>
                <p className="text-sm text-secondary-text font-medium">{title}</p>
                <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value: string; isSubItem?: boolean }> = ({ label, value, isSubItem = false }) => (
    <div className={`flex justify-between items-center py-3 ${isSubItem ? 'pl-6' : ''} border-b border-border-color/50`}>
        <span className={`text-sm ${isSubItem ? 'text-secondary-text' : 'text-secondary-text font-medium'}`}>{label}</span>
        <span className="text-base font-semibold text-primary-text">{value}</span>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    if (!results) {
        return (
            <div className="bg-surface rounded-xl shadow-lg p-8 h-full flex flex-col justify-center items-center text-center">
                <i className="fa-solid fa-magnifying-glass-chart text-6xl text-border-color mb-6"></i>
                <h3 className="text-xl font-bold text-primary-text">분석 결과를 기다리고 있습니다</h3>
                <p className="text-secondary-text mt-2">왼쪽 양식에 정보를 입력하고 '분석하기' 버튼을 눌러주세요.</p>
            </div>
        );
    }

    const isProfitPositive = results.afterTaxProfit > 0;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="투입 자본 대비 수익률" 
                    value={formatPercentage(results.returnOnInvestment)}
                    icon="fa-solid fa-percent"
                    isPositive={results.returnOnInvestment > 0}
                    isNegative={results.returnOnInvestment < 0}
                />
                <StatCard 
                    title="세후 순수익" 
                    value={formatCurrency(results.afterTaxProfit)}
                    icon="fa-solid fa-won-sign"
                    isPositive={isProfitPositive}
                    isNegative={!isProfitPositive}
                />
                <StatCard 
                    title="총 필요자금" 
                    value={formatCurrency(results.requiredCapital)}
                    icon="fa-solid fa-wallet"
                />
            </div>

            <div className="bg-surface rounded-xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold text-primary-text border-b border-border-color pb-4 mb-4">상세 계산 내역</h3>
                <div className="space-y-2">
                    <DetailItem label="낙찰가" value={formatCurrency(results.winningBidPrice)} />
                    <DetailItem label="대출 가능 금액" value={formatCurrency(results.loanableAmount)} />
                    <DetailItem label="총 취득가액" value={formatCurrency(results.totalAcquisitionCost)} />
                    <DetailItem label="취득세 (1.1%)" value={formatCurrency(results.acquisitionTax)} isSubItem={true} />
                    <DetailItem label="법무비 (0.4%)" value={formatCurrency(results.legalFees)} isSubItem={true} />
                    <DetailItem label="중개보수 (0.4%)" value={formatCurrency(results.brokerageFee)} isSubItem={true} />
                    {results.interiorCosts > 0 && <DetailItem label="인테리어비" value={formatCurrency(results.interiorCosts)} isSubItem={true} />}
                    {results.evictionCosts > 0 && <DetailItem label="명도비" value={formatCurrency(results.evictionCosts)} isSubItem={true} />}
                    {results.overdueFees > 0 && <DetailItem label="체납 관리비" value={formatCurrency(results.overdueFees)} isSubItem={true} />}
                    {results.buildingVat > 0 && <DetailItem label="건물 부가세" value={formatCurrency(results.buildingVat)} isSubItem={true} />}
                    {results.takeoverCosts > 0 && <DetailItem label="인수비용 (선순위 임차인)" value={formatCurrency(results.takeoverCosts)} isSubItem={true} />}
                    
                    <DetailItem label="세전 수익" value={formatCurrency(results.preTaxProfit)} />
                    <DetailItem label="대출이자 (연 5%, 6개월)" value={formatCurrency(results.interest)} isSubItem={true} />
                    <DetailItem label="중도상환수수료 (0.5%)" value={formatCurrency(results.prepaymentPenalty)} isSubItem={true} />

                    <DetailItem label="세후 순수익" value={formatCurrency(results.afterTaxProfit)} />
                    <DetailItem label="사업소득세 (누진세율)" value={formatCurrency(results.taxAmount)} isSubItem={true} />
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;