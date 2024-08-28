import { createStore } from 'vuex';

const store = createStore({
    state: {
        selectedAddresses: new Set(),
        selectedDestinations: [], // Store selected destinations including addresses data and products
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
        setSelectedDestinations(state, destinations) {
            console.log('Committing Destinations:', destinations); // Added log
            state.selectedDestinations = destinations; // Store the complete destination objects
        },
        clearSelectedDestinations(state) {
            state.selectedDestinations = [];
        },
        setSelectedTruck(state, truck) {
            state.selectedTruck = truck;
        },
        clearSelectedTruck(state) {
            state.selectedTruck = null;
        }
    },
    getters: {
        selectedAddresses: state => Array.from(state.selectedAddresses),
        isAddressSelected: (state) => (addressId) => state.selectedAddresses.has(addressId),
        selectedDestinations: state => state.selectedDestinations, // Return complete destinations with addresses and products
        selectedTruck: state => state.selectedTruck,
    },
    actions: {
        saveTourData({ commit }, destinations) {
            console.log('Saving Destinations:', destinations); // Added log
            commit('setSelectedDestinations', destinations);
        },
        clearTourData({ commit }) {
            commit('clearAddresses');
            commit('clearSelectedDestinations');
            commit('clearSelectedTruck');
        }
    }
});

export default store;
