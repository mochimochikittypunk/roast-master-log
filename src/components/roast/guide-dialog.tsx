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
                    <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                        <Image
                            src="/roast_guide_jp.png"
                            alt="Interface Guide"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Step-by-Step Flow */}
                    <div className="space-y-4 text-slate-300">
                        <h3 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2">基本的な流れ</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-950 p-4 rounded border border-slate-800">
                                <span className="block text-amber-500 font-bold mb-2">ステップ 1: 開始</span>
                                <p className="text-sm">
                                    生豆を投入したら、投入温度を入力した状態で、緑色の <strong className="text-green-400">START</strong> ボタンを押してください。
                                    タイマーと温度記録が始まります。
                                </p>
                            </div>

                            <div className="bg-slate-950 p-4 rounded border border-slate-800">
                                <span className="block text-amber-500 font-bold mb-2">ステップ 2: 記録</span>
                                <p className="text-sm">
                                    <strong>Yellow Point</strong> (中点) や <strong>1st Crack</strong> (1ハゼ) のタイミングでボタンを押します。
                                    温度計が接続されていない場合は、上部の入力欄から手動で温度を入力・追加できます。
                                </p>
                            </div>

                            <div className="bg-slate-950 p-4 rounded border border-slate-800">
                                <span className="block text-amber-500 font-bold mb-2">ステップ 3: 終了と保存</span>
                                <p className="text-sm">
                                    煎り止めのタイミングで <strong className="text-red-400">STOP</strong> ボタンを押します。
                                    保存ダイアログが表示されるので、Googleスプレッドシートに保存してください。
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded border border-slate-800 mt-4">
                            <h4 className="font-bold text-slate-200 mb-2">便利な機能</h4>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                                <li><strong>+1 ボタン</strong>: 直前の温度 +1℃ をワンクリックで入力できます。</li>
                                <li><strong>Compare ボタン</strong>: 過去の焙煎ログを読み込み、ゴーストカーブ（点線）として表示します。</li>
                                <li><strong>DTR (Development Time Ratio)</strong>: 1ハゼ以降、自動的に計算・表示されます。</li>
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
