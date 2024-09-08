import Vue from 'mini-vue2'
window.vm = new Vue({
    el: "#app",
    data: {
        name: "sunny",
        age: 18,
        addr: {
            province: "heilongjiang",
            city: "city",
        },
    },
});