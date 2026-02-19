'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import Image from 'next/image';

export const GuideDialog = ({ compact = false }: { compact?: boolean }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`text-xs font-bold border-slate-600 text-slate-300 hover:text-amber-400 hover:border-amber-400 h-8 ${compact ? 'w-full justify-center' : ''}`}
                    title="使い方ガイド"
                >
                    使い方
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-xl text-amber-500">Roast Master Log - 使い方ガイド</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        焙煎画面の基本的な使い方
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Annotated Screenshot */}
                    {/* Annotated Screenshot */}
                    <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                        <Image
                            src="/roast_guide_v3.png"
                            alt="Interface Guide"
                            fill
                            className="object-contain"
                        />

                        {/* Overlays / Annotations - Removed in favor of embedded annotations */}
                    </div>

                    {/* Step-by-Step Flow */}
                    <div className="space-y-4 text-slate-300">
                        <h3 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2">基本的な流れ</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-950 p-4 rounded border border-slate-800">
                                <span className="block text-amber-500 font-bold mb-2">ステップ 1: 準備・開始</span>
                                <p className="text-sm">
                                    <strong>生豆の名称</strong>を選択または手入力し、<strong>Initial Gas / Damper</strong> を設定します。
                                    投入温度を入力したら、<strong className="text-green-400">START</strong> ボタンで焙煎を開始します。
                                </p>
                            </div>

                            <div className="bg-slate-950 p-4 rounded border border-slate-800">
                                <span className="block text-amber-500 font-bold mb-2">ステップ 2: 記録・操作</span>
                                <p className="text-sm">
                                    <strong>Yellow Point</strong> や <strong>1st Crack</strong> ボタンでイベントを記録します。
                                    Gas/Damperの変更は即座にグラフに反映されます。
                                    間違えた場合は <strong className="text-slate-400">Undo</strong> ボタンで直前の操作を取り消せます。
                                </p>
                            </div>

                            <div className="bg-slate-950 p-4 rounded border border-slate-800">
                                <span className="block text-amber-500 font-bold mb-2">ステップ 3: 終了・保存</span>
                                <p className="text-sm">
                                    <strong className="text-red-400">End Roast</strong> ボタンで終了します。
                                    自動的にスクリーンショットが生成され、ログインしていれば豆の在庫が自動で引き落とされます。
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded border border-slate-800 mt-4">
                            <h4 className="font-bold text-slate-200 mb-2">新機能・便利な機能</h4>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                                <li><strong>豆名称の入力切替</strong>: キーボードアイコンで「手入力」、リストアイコンで「在庫から選択」を切り替えられます。</li>
                                <li><strong>Damperチャート</strong>: 緑色の波計でダンパー開度（0-100%）を表示します。</li>
                                <li><strong>RoR軸</strong>: 青色のRoR（上昇率）軸は右側に表示されます。</li>
                                <li><strong>Undo機能</strong>: 温度記録やイベント記録を1手戻すことができます。</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4 sm:justify-center">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className="w-full sm:w-auto min-w-[100px]">
                            閉じる
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
};
