Object.prototype.isEmpty = function () {
  return Object.keys(this).length === 0;
};

Map.prototype.isEmpty = function () {
  return !this.size;
};

Object.prototype.getChanges = function(oldObject) {
  let changes = [];
  let newObject = this;

  if (JSON.stringify(oldObject) === JSON.stringify(newObject)) {
    return false;
  }

  for(let item in newObject) {
    if(!oldObject[item])
      changes.push(item);
  }

  return changes;
};



let prevRandNum;
Map.prototype.getRandomEntry = function () {
  let randEntry;
  let randNum = prevRandNum;

  while (randNum === prevRandNum) {
    randNum = Math.round(Math.random() * (this.size - 1));
    if (this.size == 1) break; // exclude the case while we can't generate random number different from previous
  }
  prevRandNum = randNum;

  for (let entry of this.entries()) {
    if (randNum <= 0) {
      randEntry = entry;
      break;
    }
    randNum--;
  }

  return randEntry || 'no words in your vocabulary yet';
};

Map.prototype.getKey = function (passedValue) {
  let keyToFind;

  this.forEach((value, key) => {
    if (value == passedValue) {
      keyToFind = key;
    }
  });

  return keyToFind;
};


