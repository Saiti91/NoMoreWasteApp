import { createStore } from 'vuex';

const store = createStore({
    state: {
        selectedAddresses: new Set(),
        selectedRequests: new Set(), // New state to store selected request IDs
        selectedDestinations: [], // Store selected destinations including address data and products
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
        addRequest(state, requestId) {
            state.selectedRequests.add(requestId); // Add a request ID to the selectedRequests set
        },
        removeRequest(state, requestId) {
            state.selectedRequests.delete(requestId); // Remove a request ID from the selectedRequests set
        },
        clearRequests(state) {
            state.selectedRequests.clear(); // Clear all selected requests
        },
        setSelectedDestinations(state, destinations) {
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
        selectedRequests: state => Array.from(state.selectedRequests), // Getter to return selected requests
        isRequestSelected: (state) => (requestId) => state.selectedRequests.has(requestId), // Check if a request is selected
        selectedDestinations: state => state.selectedDestinations, // Return complete destinations with address and products
        selectedTruck: state => state.selectedTruck,
    },
    actions: {
        saveTourData({ commit }, destinations) {
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
