import React from 'react';
import type { InputData } from '../types';

interface InputFormProps {
    inputs: Partial<InputData>;
    onInputsChange: React.Dispatch<React.SetStateAction<Partial<InputData>>>;
    onCalculate: () => void;
    onReset: () => void;
    error: string;
}

const inputFields = [
    { name: 'appraisedValue', label: '감정가 (백만원)', placeholder: '252', required: true, icon: 'fa-solid fa-landmark', type: 'number' },
    { name: 'bidRate', label: '낙찰가율 (%)', placeholder: '75', required: true, icon: 'fa-solid fa-gavel', type: 'number' },
    { name: 'salePrice', label: '매도가 (백만원)', placeholder: '300', required: true, icon: 'fa-solid fa-sack-dollar', type: 'number' },
    { name: 'loanRatio', label: '대출비율 (%)', placeholder: '80', icon: 'fa-solid fa-hand-holding-dollar', type: 'number' },
    { name: 'loanPeriod', label: '대출기간 (개월)', placeholder: '6', icon: 'fa-solid fa-clock', type: 'number' },
    { name: 'interiorCosts', label: '인테리어비 (백만원)', placeholder: '0', icon: 'fa-solid fa-paint-roller', type: 'number' },
    { name: 'evictionCosts', label: '명도비 (백만원)', placeholder: '0', icon: 'fa-solid fa-person-walking-arrow-right', type: 'number' },
    { name: 'overdueFees', label: '체납 관리비 (백만원)', placeholder: '0', icon: 'fa-solid fa-file-invoice-dollar', type: 'number' },
    { name: 'buildingVat', label: '건물 부가세 (84㎡ 이상, 백만원)', placeholder: '0', icon: 'fa-solid fa-receipt', type: 'number' },
    { name: 'takeoverCosts', label: '인수비용 (선순위 임차인, 백만원)', placeholder: '0', icon: 'fa-solid fa-key', type: 'number' },
];

const referenceFields = [
    { name: 'caseNumber', label: '경매사건번호', placeholder: '예) 2023타경12345', icon: 'fa-solid fa-folder-open', type: 'text' },
    { name: 'address', label: '주소지', placeholder: '예) 서울특별시 강남구 테헤란로', icon: 'fa-solid fa-map-location-dot', type: 'text' },
    { name: 'landArea', label: '대지면적 (㎡)', placeholder: '예) 59.9', icon: 'fa-solid fa-ruler-combined', type: 'text' },
    { name: 'buildingArea', label: '건물면적 (㎡)', placeholder: '예) 84.9', icon: 'fa-solid fa-building', type: 'text' },
    { name: 'yearBuilt', label: '준공년도', placeholder: '예) 2015', icon: 'fa-solid fa-calendar-days', type: 'text' },
];


const InputForm: React.FC<InputFormProps> = ({ inputs, onInputsChange, onCalculate, onReset, error }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        onInputsChange(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? (value ? Number(value) : undefined) : (value || undefined)
        }));
    };

    const winningBidPrice = (inputs.appraisedValue || 0) * ((inputs.bidRate || 0) / 100);

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6 sm:p-8 space-y-6 sticky top-8">
            <h2 className="text-2xl font-bold text-primary-text border-b border-border-color pb-4">투자 정보 입력</h2>
            {inputFields.map(field => (
                <React.Fragment key={field.name}>
                    <div>
                        <label htmlFor={field.name} className="block text-sm font-medium text-secondary-text mb-1">
                            {/* FIX: Corrected the className attribute to use proper template literal syntax. */}
                            <i className={`${field.icon} text-primary w-5 mr-2`}></i>
                            {field.label} {field.required && <span className="text-red-400">*</span>}
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={inputs[field.name as keyof InputData] || ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="block w-full px-4 py-3 bg-input-bg border-border-color rounded-md focus:ring-primary focus:border-primary sm:text-sm transition duration-150 text-primary-text placeholder:text-secondary-text"
                            />
                        </div>
                    </div>
                     {field.name === 'bidRate' && (
                         <div>
                            <label htmlFor="winningBidPriceDisplay" className="block text-sm font-medium text-secondary-text mb-1">
                                {/* FIX: Corrected a typo in the className attribute. A backtick was used instead of a double quote. */}
                                <i className="fa-solid fa-money-bill-wave text-primary w-5 mr-2"></i>
                                예상 낙찰가 (백만원)
                            </label>
                            <div className="mt-1 relative rounded-md">
                                <div id="winningBidPriceDisplay" className="block w-full px-4 py-3 bg-background border-border-color rounded-md sm:text-sm text-primary-text font-semibold border">
                                    {winningBidPrice.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}

            <div className="pt-4 border-t border-border-color">
                <h3 className="text-lg font-semibold text-secondary-text mb-4">물건 정보 (참고용)</h3>
                <div className="space-y-4">
                    {referenceFields.map(field => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-secondary-text mb-1">
                                {/* FIX: Corrected the className attribute to use proper template literal syntax. */}
                                <i className={`${field.icon} text-primary w-5 mr-2`}></i>
                                {field.label}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={inputs[field.name as keyof InputData] as string || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="block w-full px-4 py-3 bg-input-bg border-border-color rounded-md focus:ring-primary focus:border-primary sm:text-sm transition duration-150 text-primary-text placeholder:text-secondary-text"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                    onClick={onReset}
                    className="w-full flex-1 justify-center py-3 px-4 border border-border-color rounded-md shadow-sm text-sm font-medium text-primary-text bg-surface hover:bg-input-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                >
                    <i className="fa-solid fa-rotate-left mr-2"></i>초기화
                </button>
                <button
                    onClick={onCalculate}
                    className="w-full flex-1 justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                >
                    <i className="fa-solid fa-chart-line mr-2"></i>분석하기
                </button>
            </div>
        </div>
    );
};

export default InputForm;