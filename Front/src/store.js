import { createStore } from 'vuex';

const store = createStore({
    state: {
        selectedAddresses: new Set(),
        selectedProducts: [],
        selectedTruck: null, // Store the selected truck object
    },
    mutations: {
        addAddress(state, addressId) {
            state.selectedAddresses.add(addressId);
        },
        removeAddress(state, addressId) {
            state.selectedAddresses.delete(addressId);
        },
        clearAddresses(state) {
            state.selectedAddresses.clear();
        },
        setSelectedProducts(state, products) {
            state.selectedProducts = products;
        },
        clearSelectedProducts(state) {
            state.selectedProducts = [];
        },
        setSelectedTruck(state, truck) { // Accept and store the entire truck object
            state.selectedTruck = truck;
        },
        clearSelectedTruck(state) {
            state.selectedTruck = null;
        }
    },
    getters: {
        selectedAddresses: state => Array.from(state.selectedAddresses),
        isAddressSelected: (state) => (addressId) => state.selectedAddresses.has(addressId),
        selectedProducts: state => state.selectedProducts,
        selectedTruck: state => state.selectedTruck, // Getter for the selected truck object
    },
    actions: {
        saveTourData({ commit }, products) {
            commit('setSelectedProducts', products);
        },
        clearTourData({ commit }) {
            commit('clearAddresses');
            commit('clearSelectedProducts');
            commit('clearSelectedTruck');
        }
    }
});

export default store;
