
$(document).ready(function() {
    localStorage.clear();
    const fetchHandler = new Fetch_handler(() => {
        new Side_panel();
        const modal =new Modal();
        const history = new History(fetchHandler);
        new Container(fetchHandler, modal, history);
    });
});