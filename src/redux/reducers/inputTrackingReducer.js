const obj = {
    keyStrokes: 0,
    endOfLine: null,
    wordStartTime: 0,
    wordStartMark: 0,
    wordEndTime: 0,
    wordEndMark: 0,
    charactersPerMinute: 0,
    wordsPerMinute: 0,
    averageSpeed: 0,
    speedHistory: [],
    levelStart: 0,
    levelFinish: 0,
    totalCharacters: 0,
    typedCharacters: 0,
    numberOfErrors: 0,
    percentOfErrors: 0,
    accuracy: 0,
}

const inputTracking = (state=obj, action) => {

    switch (action.type) {

        case 'INPUT':

            let State = {...state};

            if (State.keyStrokes === 0) {State.levelStart = Date.now()};

            State.keyStrokes++;
            
            State.endOfLine = action.userArr.length-1;

            const lastKey = action.userArr.find(el=>el.id===Number(State.keyStrokes-1));

            lastKey.time = Date.now();


            if (lastKey.key !== ' ' && lastKey.id !== State.endOfLine) {

                if (!State.wordStartTime) {
                    State.wordStartMark = lastKey.id;
                    State.wordStartTime = lastKey.time; 
                }  

            } else {
             
                // коли користувач натиснув на пробіл, розраховуємо швидкість друку (у літерах на хвилину)
                if (lastKey.id !== State.endOfLine) {
                    State.wordEndMark = lastKey.id;
                    State.wordEndTime = action.userArr[lastKey.id-1].time;
                    State.levelFinish = action.userArr[lastKey.id-1].time;
                } else {
                    State.wordEndMark = lastKey.id;
                    State.wordEndTime = lastKey.time;
                    State.levelFinish = lastKey.time;
                }
                const wordCharacters = State.wordEndMark-State.wordStartMark;
                
                const wordDuration = (State.wordEndTime - State.wordStartTime)/1000;

                State.charactersPerMinute = Math.floor(wordCharacters * 60 / wordDuration);

                // додаємо значення швидкості в масив зі статистикою та розраховуємо середню швидкість (у літерах на хвилину)
                State.speedHistory = State.speedHistory ? [...State.speedHistory, Number(State.charactersPerMinute)] : [Number(State.charactersPerMinute)];
                State.averageSpeed = Math.round((State.speedHistory.reduce((acc,el)=>acc+el, 0)) / State.speedHistory.length);

                State.wordStartMark = 0;
                State.wordStartTime = 0;
                State.wordEndMark = 0;
                State.wordEndTime = 0;
            }

            // розрахунок кількості слів на хвилину
            const levelDuration = (State.levelFinish - State.levelStart) / 1000;
            const totalWords = State.speedHistory.length;
            State.wordsPerMinute = Math.floor(totalWords * 60 / levelDuration);

            // розрахунок кількості помилок та точності друку у %
            State.totalCharacters = Number(action.userArr.length);

            State.typedCharacters = Number(action.userArr.filter(el=>el.isValid!==null).length);
            console.log('typed', State.typedCharacters);
            

            State.numberOfErrors = Number(action.userArr.filter(el=>el.isValid===false).length);
            console.log('numberOfErrors', State.numberOfErrors);

            State.percentOfErrors = Math.round(State.numberOfErrors * 100 / State.typedCharacters);
            console.log('percentOfErrors', State.percentOfErrors);

            State.accuracy = 100 - State.percentOfErrors;

            return State;

        default: 
            return state;
    
    };
};

export default inputTracking;