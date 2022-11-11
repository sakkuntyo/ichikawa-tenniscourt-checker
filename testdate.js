itinitigo = new Date((new Date()).setDate((new Date()).getDate() + 1))//今日に一日を加算した日を作成
console.log(itinitigo)
console.log(itinitigo.getFullYear() + "/" + (itinitigo.getMonth() + 1)+ "/" + itinitigo.getDate())//monthはなぜか-1で表示されるので+1
console.log(itinitigo.getFullYear() + "/" + (itinitigo.getMonth() + 12)+ "/" + itinitigo.getDate())//月がおかしくなるのでこの方法はなし

require('date-utils');
console.log(itinitigo.toFormat('YYYY/MM/DD')) 
