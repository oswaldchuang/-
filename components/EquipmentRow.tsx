import React, { useState } from 'react';
import { Equipment, EquipmentStatus, LabelStatus, EquipmentUnit } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  item: Equipment;
  onUpdateUnit: (unitIdx: number, updates: Partial<EquipmentUnit>) => void;
}

const EquipmentRow: React.FC<Props> = ({ item, onUpdateUnit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const activeUnit = item.units[activeUnitIndex];
  
  const checkedUnitsCount = item.units.filter(u => !!u.lastChecked).length;
  const isAllChecked = checkedUnitsCount === item.units.length;

  const getStatusColor = (status: EquipmentStatus) => {
    switch(status) {
      case EquipmentStatus.NORMAL: return 'bg-green-500';
      case EquipmentStatus.DAMAGED: return 'bg-red-500';
      case EquipmentStatus.MISSING: return 'bg-orange-500';
      case EquipmentStatus.OUT_FOR_SHOOTING: return 'bg-blue-500';
      case EquipmentStatus.LABEL_REPLACEMENT: return 'bg-indigo-500';
      default: return 'bg-gray-300';
    }
  };

  const handleStatusUpdate = (status: EquipmentStatus) => {
    if (status !== EquipmentStatus.OUT_FOR_SHOOTING) {
      onUpdateUnit(activeUnit.unitIndex, { status, location: undefined });
    } else {
      onUpdateUnit(activeUnit.unitIndex, { status });
    }
  };

  const handleAISuggestRemark = async () => {
    if (!activeUnit.status) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an equipment manager for a professional film studio. Suggest a concise, professional remark in Chinese (traditional) for a piece of equipment named '${item.name}' which is currently in '${activeUnit.status}' status.`,
      });
      const text = response.text;
      if (text) {
        const cleanedText = text.trim().replace(/^["']|["']$/g, '');
        onUpdateUnit(activeUnit.unitIndex, { remark: cleanedText });
      }
    } catch (e) {
      console.error('AI Remark Error:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className={`ios-card overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500/20 shadow-lg' : ''}`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-gray-900">{item.name}</h4>
            {activeUnit.status === EquipmentStatus.LABEL_REPLACEMENT && (
              <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md border border-indigo-100 font-black">
                🏷️ 需換標
              </span>
            )}
            {isAllChecked && (
              <span className="bg-blue-100 text-blue-600 p-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.category}</span>
            <span className="text-[10px] text-gray-300">•</span>
            <span className={`text-[10px] font-bold ${isAllChecked ? 'text-green-600' : 'text-blue-500'}`}>
              已清點 {checkedUnitsCount} / {item.quantity}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-1">
            {item.units.map(u => (
              <div key={u.id} className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${u.lastChecked ? getStatusColor(u.status) : 'bg-gray-200'}`} />
            ))}
          </div>
          <svg className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 bg-gray-50/30 border-t border-gray-50">
          {item.quantity > 1 && (
            <div className="my-4 overflow-x-auto no-scrollbar">
              <div className="flex p-1 bg-gray-200/50 rounded-xl space-x-1 min-w-max">
                {item.units.map((unit, idx) => (
                  <button
                    key={unit.id}
                    onClick={() => setActiveUnitIndex(idx)}
                    className={`relative py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                      activeUnitIndex === idx ? 'bg-white text-blue-600 shadow-sm border border-blue-50' : 'text-gray-500'
                    }`}
                  >
                    {unit.unitLabel || `${unit.unitIndex} 號機`}
                    {unit.lastChecked && <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${getStatusColor(unit.status)}`} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-gray-400 uppercase">
                當前: <span className="text-blue-600">{activeUnit.unitLabel || `${activeUnit.unitIndex}#`}</span>
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-2 px-1">設定狀況</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(EquipmentStatus).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                        activeUnit.status === status 
                          ? `${status === EquipmentStatus.LABEL_REPLACEMENT ? 'bg-indigo-600 border-indigo-600' : 'bg-blue-600 border-blue-600'} text-white shadow-md` 
                          : 'bg-white border-gray-100 text-gray-600'
                      }`}
                    >
                      {status === EquipmentStatus.LABEL_REPLACEMENT ? '🏷️ ' + status : status}
                    </button>
                  ))}
                </div>
              </div>

              {activeUnit.status === EquipmentStatus.LABEL_REPLACEMENT && (
                <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-200 animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-indigo-600 uppercase">🏷️ 標籤更換備註</label>
                    <span className="text-[8px] bg-white text-indigo-400 px-1.5 rounded-full border border-indigo-100">必填細節</span>
                  </div>
                  <textarea
                    className="w-full bg-white border border-indigo-100 rounded-xl p-3 text-sm resize-none h-20 shadow-inner focus:border-indigo-400"
                    placeholder="請輸入：需更換的原因或新標籤編號..."
                    value={activeUnit.remark}
                    onChange={(e) => onUpdateUnit(activeUnit.unitIndex, { remark: e.target.value })}
                  />
                </div>
              )}

              {activeUnit.status !== EquipmentStatus.LABEL_REPLACEMENT && (
                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">狀態備註</label>
                    <button onClick={handleAISuggestRemark} disabled={isAiLoading} className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {isAiLoading ? '...' : '✨ AI 建議'}
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm resize-none h-20 focus:border-blue-300"
                    placeholder="輸入備註..."
                    value={activeUnit.remark}
                    onChange={(e) => onUpdateUnit(activeUnit.unitIndex, { remark: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentRow;