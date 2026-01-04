import React, { useState, useCallback } from 'react';
import type { InputData, CalculationResult } from './types';
import { calculateProfitability } from './services/calculator';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';

const App: React.FC = () => {
    const [inputs, setInputs] = useState<Partial<InputData>>({});
    const [results, setResults] = useState<CalculationResult | null>(null);
    const [error, setError] = useState<string>('');

    const handleCalculate = useCallback(() => {
        if (!inputs.appraisedValue || !inputs.bidRate || !inputs.salePrice) {
            setError('감정가, 낙찰가율, 매도가는 필수 입력 항목입니다.');
            setResults(null);
            return;
        }
        setError('');
        const resultData = calculateProfitability(inputs as InputData);
        setResults(resultData);
    }, [inputs]);

    const handleReset = useCallback(() => {
        setInputs({});
        setResults(null);
        setError('');
    }, []);

    return (
        <div className="min-h-screen bg-background text-secondary-text p-4 sm:p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-text tracking-tight">
                        <i className="fa-solid fa-calculator text-primary mr-3"></i>
                        부동산 경매 수익률 분석기
                    </h1>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
                        필요 정보를 입력하여 예상 투자 수익률과 상세 비용 내역을 확인하세요.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <InputForm
                            inputs={inputs}
                            onInputsChange={setInputs}
                            onCalculate={handleCalculate}
                            onReset={handleReset}
                            error={error}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <ResultsDisplay results={results} inputs={inputs} />
                    </div>
                </main>
                
                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} 부동산 경매 수익률 분석기. 모든 권리 보유.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;