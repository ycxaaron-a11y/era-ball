export const positionNames = Object.freeze({
  ST: '前锋', LW: '左边锋', RW: '右边锋', LM: '左前卫', RM: '右前卫',
  CM: '中前卫', CAM: '前腰', CDM: '后腰', SS: '影锋',
  LB: '左后卫', RB: '右后卫', CB: '中后卫', LWB: '左翼卫', RWB: '右翼卫',
  GK: '门将', SUB: '替补'
});
export const positionName = code => positionNames[code] || '位置';
export const positionList = codes => codes.map(positionName).join('／');
export const heightLabel = p => Number.isInteger(p?.heightCm) ? `${p.heightCm} 厘米` : '身高待补充';
