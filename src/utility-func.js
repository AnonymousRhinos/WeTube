

export const getTime = () => {
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    time[0] = (+time[0] + 7) % 12;
    time = time.join(':');
    return time
  }

export const establishColor = (colorsList) => {
    let names = colorsList.names;
    let randomProperty = function (colorNames) {
      let keys = Object.keys(colorNames)
      return colorNames[keys[Math.floor(keys.length * Math.random())]];
    };
    return randomProperty(names)
  }

