export const OBSERVATORY_ORDER=['orbit','moon','star'];
export function discoveryStep(progress,symbol){const n=Number.isInteger(progress)&&progress>=0&&progress<3?progress:0;if(symbol===OBSERVATORY_ORDER[n])return {progress:n+1,open:n===2};return {progress:symbol===OBSERVATORY_ORDER[0]?1:0,open:false};}
