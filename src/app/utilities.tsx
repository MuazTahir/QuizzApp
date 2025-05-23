// export const shuffleArray=(array:any[])=>
//     [...array].sort(()=>Math.random()-0.5) 
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default shuffleArray;