const firstWordleDate = new Date(2021, 5, 19, 0, 0, 0, 0);
const numOfMsInDay = 24 * 60 * 60 * 1000;
const getDayOffset = (d1, d2) => {
  const date1 = new Date(d1);
  const msBetweenMidnightsLocalTime = new Date(d2).setHours(0,0,0,0) - date1.setHours(0,0,0,0);
  return Math.round(msBetweenMidnightsLocalTime / numOfMsInDay);
};

document.getElementById('dayNumInput').value = getDayOffset(firstWordleDate, new Date());

// When the button is clicked, set local storage and refresh
// so background script chooses appropriate level
document.getElementById('catchupButton').addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: updateDay,
    args: [document.getElementById('dayNumInput').value]
  });
});

function updateDay(dayNum) {
	const getLocalStorageKeyValue = (storageKey) => JSON.parse(localStorage.getItem(storageKey));
	const changeValue = (storageKey, key, newValue) => {
    const obj = getLocalStorageKeyValue(storageKey);
    obj[key] = newValue;
    localStorage.setItem(storageKey, JSON.stringify(obj));
    return obj;
  };
  //changeValue('nyt-wordle-state', 'gameStatus', 'IN_PROGRESS');
  if (getLocalStorageKeyValue('nyt-wordle-state')?.rowIndex > 0 &&
  	  getLocalStorageKeyValue('nyt-wordle-state')?.gameStatus === 'IN_PROGRESS' &&
      !confirm('Are you sure you want to reset the board and try Wordle # '
      + dayNum + ' from the beginning?')) {
    return;
  }
  changeValue('nyt-wordle-state', 'boardState', ["","","","","",""]);
  changeValue('nyt-wordle-state', 'evaluations', [null,null,null,null,null,null]);
  changeValue('nyt-wordle-state', 'rowIndex', 0);
  //localStorage.setItem('wordle-catchup-reset', true); // change gameStatus to IN_PROGRESS
  // changeValue('nyt-wordle-state', 'gameStatus', 'IN_PROGRESS');
  // See: https://stackoverflow.com/a/19691491
  const firstWordleDate = new Date(2021, 5, 19, 0, 0, 0, 0);
	const d = new Date(firstWordleDate);
	d.setDate(d.getDate() + parseInt(dayNum) - 1);
	localStorage.setItem('wordle-catchup-nyt-lastPlayedTs', d.getTime());
	localStorage.setItem('wordle-catchup-nyt-lastCompletedTs', d.getTime());
	history.go(0);
}