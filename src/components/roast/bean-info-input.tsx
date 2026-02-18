'use client';

import { useRoast } from "@/context/roast-context";
import { Input } from "@/components/ui/input";

export const BeanInfoInput = () => {
    const { beanName, setBeanName, beanWeight, setBeanWeight } = useRoast();

    return (
        <div className="flex flex-col gap-2 w-full lg:w-auto lg:flex-row lg:items-center">
            <Input
                type="text"
                placeholder="豆の名称"
                value={beanName}
                onChange={(e) => setBeanName(e.target.value)}
                className="bg-slate-950 border-slate-700 text-base h-10 w-full lg:w-64 placeholder:text-slate-600"
            />
            <div className="relative w-full lg:w-32">
                <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="投入量"
                    value={beanWeight}
                    onChange={(e) => setBeanWeight(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-base h-10 w-full pr-8 text-right placeholder:text-slate-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold pointer-events-none">
                    g
                </span>
            </div>
        </div>
    );
};
