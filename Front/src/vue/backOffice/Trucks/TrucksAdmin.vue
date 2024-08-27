<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import Swal from "sweetalert2";
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";

const trucks = ref([]);
const truckForm = ref({
  Registration: '',
  Capacity: '',
  Model: '',
  Conditions: '',
});
const editMode = ref(false);
const currentTruckId = ref(null);

const fetchTrucks = async () => {
  try {
    const response = await axios.get('/trucks');
    trucks.value = response.data;
    console.log('Trucks:', trucks.value);
  } catch (error) {
    console.error('Error fetching trucks:', error);
  }
};

const handleSubmit = async () => {
  try {
    if (editMode.value) {
      // Update the truck
      await axios.patch(`/trucks/${currentTruckId.value}`, truckForm.value);
      Swal.fire('Success', 'Camion mis à jour avec succès', 'success');
    } else {
      // Add a new truck
      await axios.post('/trucks', truckForm.value);
      Swal.fire('Success', 'Camion ajouté avec succès', 'success');
    }
    fetchTrucks(); // Refresh the truck list
    resetForm();
  } catch (error) {
    console.error('Error submitting form:', error);
    Swal.fire('Error', 'Il y a eu un problème lors de la soumission du formulaire', 'error');
  }
};

const editTruck = (truck) => {
  truckForm.value = { ...truck };
  currentTruckId.value = truck.Truck_ID;
  editMode.value = true;
};

const deleteTruck = async (truckId) => {
  try {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous êtes sur le point de supprimer ce camion, cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      await axios.delete(`/trucks/${truckId}`);
      Swal.fire('Deleted', 'Camion supprimé avec succès', 'success');
      fetchTrucks(); // Refresh the truck list
    }
  } catch (error) {
    console.error('Error deleting truck:', error);

    if (error.response && error.response.data && error.response.data.error) {
      const forceDelete = await Swal.fire({
        title: 'Erreur',
        text: `${error.response.data.error}. Voulez-vous supprimer quand même ?`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer quand même !',
        cancelButtonText: 'Annuler'
      });

      if (forceDelete.isConfirmed) {
        try {
          await axios.delete(`/trucks/${truckId}?force=true`);
          Swal.fire('Deleted', 'Camion supprimé malgré les références existantes.', 'success');
          fetchTrucks(); // Refresh the truck list
        } catch (forceError) {
          Swal.fire('Error', 'La suppression forcée a échoué.', 'error');
        }
      }
    } else {
      Swal.fire('Error', 'Il y a eu un problème lors de la suppression du camion', 'error');
    }
  }
};

const resetForm = () => {
  truckForm.value = {
    Registration: '',
    Capacity: '',
    Model: '',
    Conditions: '',
  };
  editMode.value = false;
  currentTruckId.value = null;
};

onMounted(() => {
  fetchTrucks();
});
</script>

<template>
  <div class="trucks-management">
    <HeaderBackOffice />
    <div class="spacer"></div>

    <h1>Gestion des Camions</h1>

    <!-- Formulaire pour ajouter ou mettre à jour un camion -->
    <div class="truck-form">
      <h2>{{ editMode ? 'Modifier le Camion' : 'Ajouter un Camion' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="registration">Immatriculation:</label>
          <input type="text" id="registration" v-model="truckForm.Registration" required />
        </div>
        <div>
          <label for="capacity">Capacité:</label>
          <input type="number" id="capacity" v-model="truckForm.Capacity" required />
        </div>
        <div>
          <label for="model">Modèle:</label>
          <input type="text" id="model" v-model="truckForm.Model" required />
        </div>
        <div>
          <label for="conditions">Conditions (1-5):</label>
          <input type="number" id="conditions" v-model="truckForm.Conditions" min="1" max="5" required />
        </div>
        <button type="submit">{{ editMode ? 'Mettre à jour' : 'Ajouter' }}</button>
        <button type="button" @click="resetForm">Annuler</button>
      </form>
    </div>

    <!-- Liste des camions -->
    <div class="truck-list">
      <h2>Liste des Camions</h2>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Immatriculation</th>
          <th>Capacité</th>
          <th>Modèle</th>
          <th>Conditions</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="truck in trucks" :key="truck.Truck_ID">
          <td>{{ truck.Truck_ID }}</td>
          <td>{{ truck.Registration }}</td>
          <td>{{ truck.Capacity }}</td>
          <td>{{ truck.Model }}</td>
          <td>{{ truck.Conditions }}</td>
          <td>
            <button @click="editTruck(truck)">Modifier</button>
            <button @click="deleteTruck(truck.Truck_ID)">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.trucks-management {
  width: 80%;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

h1, h2 {
  color: #2c3e50;
  font-weight: 600;
}

.truck-form, .truck-list {
  margin: 20px 0;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.truck-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.truck-form form div {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #34495e;
}

input[type="text"], input[type="number"] {
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  transition: border-color 0.3s;
}

input[type="text"]:focus, input[type="number"]:focus {
  border-color: #3498db;
  outline: none;
}

button {
  padding: 10px 15px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

button[type="submit"] {
  background-color: #2ecc71;
  color: white;
}

button[type="submit"]:hover {
  background-color: #27ae60;
}

button[type="button"] {
  background-color: #e74c3c;
  color: white;
}

button[type="button"]:hover {
  background-color: #c0392b;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ecf0f1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

table th, table td {
  padding: 15px;
  text-align: left;
  color: #2c3e50;
}

table th {
  background-color: #3498db;
  color: white;
  font-weight: 600;
}

table td {
  border-bottom: 1px solid #bdc3c7;
}

table tr:last-child td {
  border-bottom: none;
}

table tr:hover {
  background-color: #dfe6e9;
}

button {
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

</style>
