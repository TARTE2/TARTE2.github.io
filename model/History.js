function History(fetchHandler) {
    this.history = [];
    this.fetchHandler = fetchHandler;
    this.currentIndex = 0;
    this.maxIndex = 0;
    this.firstelem = this.fetchHandler.getCopyOfOriginalData();

    this.init();
}

History.prototype = {
    init: function () {
        this.history.push(this.firstelem);
    },
    getHistory: function () {
        return this.history;
    },
    setOriginalData: function (data) {
        const copy_data = JSON.parse(JSON.stringify(data));
        this.history = [];
        this.firstelem = copy_data;
        this.history.push(copy_data);
        this.currentIndex = 0;
        this.maxIndex = this.currentIndex;
    },
    addNewData: function (data) {
        const copy_data = JSON.parse(JSON.stringify(data));

        if (this.currentIndex === this.maxIndex) {
            this.history.push(copy_data);
            this.currentIndex += 1;
            this.maxIndex += 1;
        } else {
            if (this.currentIndex === 0) {
                this.history = [this.firstelem, copy_data];
            } else {
                this.history = this.history.slice(0, this.currentIndex + 1);
                this.history.push(copy_data);
            }
            this.currentIndex += 1;
            this.maxIndex = this.currentIndex;
        }
    },

    getPreviousVersion: function () {
        if (this.currentIndex > 0) {
            this.currentIndex -= 1;
        }
        return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    },

    getNextVersion: function () {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex += 1;
        }
        return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    },
    getLastIndex: function () {
        return this.maxIndex;
    },
    getCurrentIndex: function () {
        return this.currentIndex;
    },
    getFirstVersion: function () {
        this.maxIndex = 0;
        this.currentIndex = 0;
        return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
};