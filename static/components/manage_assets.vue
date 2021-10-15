const ManageAssets  = {
  data () {
    return {
      loading: true,
      showSuccessText: false,
      showErrorText: false,
      showWarningText: false,
      assets: [],
      showGetModal: false,
      showPostModal: false,
      formAction: '',
      timezone: '',
      selectedAsset: {
        id: null,
        name: null,
        category: null,
        created: null
      },
      newAsset: {
        name: null,
        category: null,
      },
    }
  },
  methods: {
    parseDateTime: function(dateTimeString) {
      const date = new Date(dateTimeString);

      const yyyy = date.getFullYear();
      const mmm = date.getMonth() + 1;
      const dd = date.getDate();
      const hh = date.getHours();
      const mm = date.getMinutes();
      const ss = date.getSeconds();

      return `${dd}.${mmm}.${yyyy} ${hh}:${mm}:${ss}`
    },

    showActionText: function(action) {
      if (action === 'success') {
        this.showSuccessText = true;

        setTimeout(function() {
          this.showSuccessText = false;
        }.bind(this), 2000);
      }

      if (action === 'error') {
        this.showErrorText = true;

        setTimeout(function() {
          this.showErrorText = false;
        }.bind(this), 2000);
      }

      if (action === 'warning') {
        this.showWarningText = true;

        setTimeout(function() {
          this.showWarningText = false;
        }.bind(this), 2000);
      }
    },

    createAsset: function() {
      const url = '/api/asset';

      console.log(this.newAsset)

      axios.post(url, this.newAsset)
        .then(response => {
          console.log(this.newAsset)
          console.log(response);

          this.showPostModal = false;
          this.getAllAssets();
          this.showActionText('success');
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAllAssets: function() {
      const url = '/api/asset'

      this.loading = true;

      axios.get(url)
        .then(response => {
          if (Array.isArray(response.data)) {
            console.log('array');
            console.log(response.data);
            this.assets = response.data;
          } else {
            console.log('object');
            this.assets = [response.data];
          }

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAssetById: function(data) {
      let id = data.target.value;

      const url = `/api/asset/${id}`;

      axios.get(url)
        .then(response => {
          this.selectedAsset.id = response.data.id;
          this.selectedAsset.name = response.data.name;
          this.selectedAsset.category = response.data.category;
          this.selectedAsset.created = response.data.created;

          this.showGetModal = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAssetByIdOnlyData: function(data) {
      let id = data.target.value;
      this.loading = true;

      const url = `/api/asset/${id}`;

      axios.get(url)
        .then(response => {
          this.selectedAsset.id = response.data.id;
          this.selectedAsset.name = response.data.name;
          this.selectedAsset.category = response.data.category;
          this.selectedAsset.created = response.data.created;

          this.loading = false;

          console.log(this.selectedAsset)
        })
        .catch((error) => {
          console.log(error);
        });
    },

    updateAssetById: function(data) {
      let id = data.target.value;

      const url = `/api/asset/${id}`;

      console.log(this.selectedAsset)

      axios.put(url, this.selectedAsset)
        .then(response => {
          console.log(response);

          this.showPostModal = false;
          this.getAllAssets();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    deleteAssetById: function(data) {
      let id = data.target.value;

      const url = `/api/asset/${id}`;

      axios.delete(url)
        .then(response => {
          this.getAllAssets();
        })
        .catch((error) => {
          console.log(error);
        });
    },

  },
  mounted() {
    axios.get(`/api/asset`)
      .then(response => {
        if (Array.isArray(response.data)) {
          console.log('array');
          this.assets = response.data;
        } else {
          console.log('object');
          this.assets = [response.data];
        }

        console.log(this.assets);
        this.loading = false;
      })
  },
  template: `
    <div class="container">
      <div class="header">
        <div class="row">
          <h1>
            <span>Assets</span>
            <button v-on:click="showPostModal = true; formAction = 'Create';" type="button" class="btn yellow_button">Создать</button>
            <button v-on:click="getAllAssets" type="button" class="btn purple_button">Обновить</button>
          </h1>
        </div>
          <p v-if="showSuccessText === true" class="success_text">Success: some text for success action</p>
          <p v-if="showErrorText === true" class="error_text">Error: some text for error action</p>
          <p v-if="showWarningText === true" class="warning_text">Warning: some text for warning action</p>
      </div>



      <div v-if="loading === false" class="table-responsive">
        <table class="table table-sm table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Действие</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="asset in assets">
              <td>{{ asset.name }}</td>
              <td>{{ asset.category }}</td>

              <td>
                <button v-bind:value="asset.id" v-on:click="getAssetById" type="button" class="btn blue_button">Инфо</button>
                <button v-bind:value="asset.id" v-on:click="showPostModal = true; formAction = 'Update'; getAssetByIdOnlyData($event, asset.id)" type="button" class="btn green_button">Изменить</button>
                <button v-bind:value="asset.id" v-on:click="deleteAssetById" type="button" class="btn red_button">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>



        <transition name="modal" v-if="showPostModal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                
                  <div class="modal-header">
                    <h5 class="modal-title">{{ formAction }}</h5>
                  </div>

                  <div class="modal-body">
                    <p v-if="formAction === 'Update'">Asset Id: <span>{{ selectedAsset.id }}</span></p>

                    <div class="form-group">
                      <label for="productInputDescription">Name</label>
                      <input v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newAsset.name">
                      <input v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedAsset.name" value="selectedAsset.name">
                    </div>

                    <div class="form-group">
                      <label for="productInputDescription">Category</label>
                      <input v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newAsset.category">
                      <input v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedAsset.category" value="selectedAsset.category">
                    </div>
                  </div>

                  <div class="modal-footer">
                    <button type="button" class="btn red_button" v-on:click="showPostModal = false">Close</button>
                    <button v-if="formAction === 'Create'" type="button" class="btn yellow_button" @click.prevent="createAsset()">{{ formAction }}</button>
                    <button v-else type="button" class="btn green_button" v-bind:value="selectedAsset.id" @click.prevent="updateAssetById">{{ formAction }}</button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </transition>



        <transition name="modal" v-if="showGetModal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Asset View</h5>
                  </div>
                  <div class="modal-body">
                    <p>Booking Id: <span>{{ selectedAsset.id }}</span></p>
                  
                    <p>Name: <span>{{ selectedAsset.name }}</span></p>
                    <p>Category: <span>{{ selectedAsset.category }}</span></p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn red_button" v-on:click="showGetModal = false">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>



      <div v-if="loading === true" class="spring-spinner">
        <div class="spring-spinner-part top">
          <div class="spring-spinner-rotator"></div>
        </div>
        <div class="spring-spinner-part bottom">
          <div class="spring-spinner-rotator"></div>
        </div>
      </div>

    </div>
  `
}
