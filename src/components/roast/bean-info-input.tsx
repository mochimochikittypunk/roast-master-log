'use client';

import { Keyboard, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRoast } from "@/context/roast-context";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { createSupabaseClient } from "@/lib/supabase-client";
import { useAuth } from "@clerk/nextjs";
import { AuthControl } from "@/components/roast/auth-control";

type Bean = {
    id: string;
    name: string;
};

export const BeanInfoInput = () => {
    const { beanName, setBeanName, beanId, setBeanId, beanWeight, setBeanWeight } = useRoast();
    const { getToken, userId } = useAuth();
    const [beans, setBeans] = useState<Bean[]>([]);
    const [loading, setLoading] = useState(false);
    const [isManualInput, setIsManualInput] = useState(false);

    useEffect(() => {
        const fetchBeans = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = await createSupabaseClient(token);

                const { data, error } = await supabase
                    .from('inventory')
                    .select('id, name')
                    .order('name');

                if (error) {
                    console.error('Error fetching beans:', error);
                    return;
                }

                if (data) {
                    setBeans(data);
                }
            } catch (err) {
                console.error('Failed to fetch beans:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBeans();
    }, [userId, getToken]);

    const comboboxItems = beans.map(b => ({ value: b.id, label: b.name }));

    return (
        <div className="flex flex-col gap-2 w-full lg:w-auto lg:flex-row lg:items-center">
            <div className="w-full lg:w-72 flex gap-2">
                <div className="flex-1">
                    {userId && !isManualInput ? (
                        <Combobox
                            items={comboboxItems}
                            value={beanId ?? ""}
                            onChange={(val) => {
                                const found = beans.find(b => b.id === val);
                                if (found) {
                                    setBeanName(found.name);
                                    setBeanId(found.id);
                                } else {
                                    setBeanName("");
                                    setBeanId(null);
                                }
                            }}
                            placeholder={loading ? "読み込み中..." : "豆を選択"}
                            searchPlaceholder="豆を検索..."
                            emptyText="見つかりません"
                            className="bg-slate-950 border-slate-700 text-base h-10 w-full justify-between"
                        />
                    ) : (
                        <Input
                            type="text"
                            placeholder={userId ? "豆の名称 (手入力)" : "豆の名称 (ログインで在庫連携)"}
                            value={beanName}
                            onChange={(e) => {
                                setBeanName(e.target.value);
                                if (userId) setBeanId(null); // Clear ID on manual edit
                            }}
                            className="bg-slate-950 border-slate-700 text-base h-10 w-full placeholder:text-slate-600"
                        />
                    )}
                </div>
                {userId && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsManualInput(!isManualInput)}
                        title={isManualInput ? "リストから選択" : "手入力に切り替え"}
                        className="border-slate-700 bg-slate-900 shrink-0"
                    >
                        {isManualInput ? <List className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
                    </Button>
                )}
            </div>
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

            {/* Auth Buttons - Desktop Only */}
            <div className="ml-2 hidden lg:block">
                <AuthControl />
            </div>
        </div>
    );
};
