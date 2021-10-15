const ManageBooking  = {
  data () {
    return {
      loading: true,
      showSuccessText: false,
      showErrorText: false,
      showWarningText: false,
      bookings: [],
      showGetModal: false,
      showPostModal: false,
      showRatingModal: false,
      formAction: '',
      timezone: '',
      selectedBooking: {
        id: null,
        from: null,
        to: null,
        start_time: null,
        status: null,
        end_time: null,
        expected_duration: null,
        actual_duration: null,
        description: null,
        email: null,
        first_name: null,
        last_name: null,
        department: null,
        role: null
      },
      newBooking: {
        from: null,
        to: null,
        start_time: null,
        expected_duration: null,
        description: null,
        email: null,
        first_name: null,
        last_name: null,
        department: null,
        role: null
      },

      assets: [],
      assetId: null,
      assetCount: null,
      assetsList: {}, // key: id, value: count
      orderAssetList: [],

      rating: {
        id: null,
        star_rating: null,
        feedback: null
      }
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

    createBooking: function() {
      const url = '/api/order';

      this.newBooking.expected_duration = Number(this.newBooking.expected_duration)
      // this.newBooking.start_time = new Date(this.newBooking.start_time).toISOString()

      console.log(this.newBooking)

      axios.post(url, {'booking_info': this.newBooking, 'assets_list': this.assetsList})
        .then(response => {
          console.log(this.newBooking)
          console.log(response);

          this.showPostModal = false;
          this.getAllBookings();
          this.showActionText('success');
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAllBookings: function() {
      const url = '/api/order'

      this.loading = true;

      axios.get(url)
        .then(response => {
          if (Array.isArray(response.data)) {
            console.log('array');
            this.bookings = response.data;
          } else {
            console.log('object');
            this.bookings = [response.data];
          }

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getBookingById: function(data) {
      let id = data.target.value;

      const url = `/api/order/${id}`;

      axios.get(url)
        .then(response => {
          let bookingInfo = response.data.booking_info;
          this.orderAssetList = response.data.assets_list;

          this.selectedBooking.id = bookingInfo.id;
          this.selectedBooking.from = bookingInfo.from;
          this.selectedBooking.to = bookingInfo.to;
          this.selectedBooking.start_time = bookingInfo.start_time;
          this.selectedBooking.end_time = bookingInfo.end_time;
          this.selectedBooking.expected_duration = bookingInfo.expected_duration;
          this.selectedBooking.actual_duration = bookingInfo.actual_duration;
          this.selectedBooking.status = bookingInfo.status;
          this.selectedBooking.email = bookingInfo.email;
          this.selectedBooking.description = bookingInfo.description;
          this.selectedBooking.first_name = bookingInfo.first_name;
          this.selectedBooking.last_name = bookingInfo.last_name;
          this.selectedBooking.department = bookingInfo.department;
          this.selectedBooking.role = bookingInfo.role;

          this.rating.star_rating = bookingInfo.star_rating;
          this.rating.feedback = bookingInfo.feedback;

          console.log(this.rating)

          this.showGetModal = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getBookingByIdOnlyData: function(data) {
      let id = data.target.value;
      this.loading = true;

      const url = `/api/order/${id}`;

      axios.get(url)
        .then(response => {
          let bookingInfo = response.data.booking_info;
          this.orderAssetList = response.data.assets_list;

          this.selectedBooking.id = bookingInfo.id;
          this.selectedBooking.from = bookingInfo.from;
          this.selectedBooking.to = bookingInfo.to;
          this.selectedBooking.start_time = bookingInfo.start_time;
          this.selectedBooking.end_time = bookingInfo.end_time;
          this.selectedBooking.expected_duration = bookingInfo.expected_duration;
          this.selectedBooking.actual_duration = bookingInfo.actual_duration;
          this.selectedBooking.status = bookingInfo.status;
          this.selectedBooking.email = bookingInfo.email;
          this.selectedBooking.description = bookingInfo.description;
          this.selectedBooking.first_name = bookingInfo.first_name;
          this.selectedBooking.last_name = bookingInfo.last_name;
          this.selectedBooking.department = bookingInfo.department;
          this.selectedBooking.role = bookingInfo.role;

          console.log(this.orderAssetList)

          this.loading = false;

          console.log(this.selectedBooking)
        })
        .catch((error) => {
          console.log(error);
        });
    },

    updateBookingById: function(data) {
      let id = data.target.value;

      const url = `/api/order/${id}`;

      this.selectedBooking.expected_duration = Number(this.selectedBooking.expected_duration);
      this.selectedBooking.actual_duration = Number(this.selectedBooking.actual_duration);

      console.log(this.selectedBooking)

      axios.put(url, this.selectedBooking)
        .then(response => {
          console.log(response);

          this.showPostModal = false;
          this.getAllBookings();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    deleteBookingById: function(data) {
      let id = data.target.value;

      const url = `/api/order/${id}`;

      axios.delete(url)
        .then(response => {
          this.getAllBookings();
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

    selectAsset: function(data) {
      console.log(data)
      this.assetId = data.id;
    },

    addAssetToList: function() {
      if (this.assetId != null && this.assetCount != null && isNaN(this.assetCount) == false) {
        Vue.set(this.assetsList, parseInt(this.assetId), parseInt(this.assetCount));
      }
      console.log(this.assetsList);
    },

    deleteAssetFromList: function(data) {
      Vue.delete(this.assetsList, data.target.value);
      console.log(this.assetsList);
    },



    sendFeedback: function(data) {
      const url = `/api/order_feedback/${this.rating.id}`;

      // console.log(this.selectedBooking)

      axios.put(url, this.rating)
        .then(response => {
          console.log(response);

          this.showRatingModal = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }

  },
  mounted() {
    this.getAllBookings();
    this.getAllAssets();
  },
  template: `
    <div class="container">
      <div class="header">
        <div class="row">
          <h1>
            <span>Поездки</span>
            <button v-on:click="showPostModal = true; formAction = 'Create';" type="button" class="btn yellow_button">Создать</button>
            <button v-on:click="getAllBookings" type="button" class="btn purple_button">Обновить</button>
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
              <th>ID</th>
              <th>Из</th>
              <th>В</th>
              <th>Начало</th>
              <th>Ожид. часов</th>
              <th>Факт. часов</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="booking in bookings">
              <td>{{ booking.id }}</td>
              <td>{{ booking.from }}</td>
              <td>{{ booking.to }}</td>
              <td>{{ parseDateTime(booking.start_time) }}</td>
              <td>{{ booking.expected_duration }}</td>
              <td>{{ booking.actual_duration }}</td>

              <td v-if="booking.status === 'created'"><span class="log_text">Создан</span></td>
              <td v-if="booking.status === 'prepare'"><span class="warning_text">В подготовке</span></td>
              <td v-if="booking.status === 'process'"><span class="info_text">В пути</span></td>
              <td v-if="booking.status === 'delivered'"><span class="success_text">Доставлен</span></td>
              <td v-if="booking.status === 'canceled'"><span class="error_text">Отменен</span></td>

              <td>
                <button v-bind:value="booking.id" v-on:click="getBookingById" type="button" class="btn blue_button">Инфо</button>
                <button v-bind:value="booking.id" v-on:click="showPostModal = true; formAction = 'Update'; getBookingByIdOnlyData($event, booking.id)" type="button" class="btn green_button">Изменить</button>
                <button v-bind:value="booking.id" v-on:click="deleteBookingById" type="button" class="btn red_button">Удалить</button>
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
                    <p v-if="formAction === 'Update'">Booking Id: <span>{{ selectedBooking.id }}</span></p>

                    <div v-if="formAction === 'Update'" class="form-group">
                      <label for="productInputName">Status</label>
                      <select v-model="selectedBooking.status" class="form-control" id="productInputCode">
                        <option value="created">Создан</option>
                        <option value="prepare">В подготовке</option>
                        <option value="process">В пути</option>
                        <option value="delivered">Доставлен</option>
                        <option value="canceled">Отменен</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <div class="row">
                        <div class="col">
                          <label for="productInputName">From</label>
                          <select v-if="formAction === 'Create'" v-model="newBooking.from" class="form-control" id="productInputCode">
                            <option value="Furmanov">Корпус на Фурманова</option>
                            <option value="Pushkin">Корпус на Пушкина</option>
                          </select>

                          <select v-else v-model="selectedBooking.from" class="form-control" id="productInputCode">
                            <option value="Furmanov">Корпус на Фурманова</option>
                            <option value="Pushkin">Корпус на Пушкина</option>
                          </select>
                        </div>
                        <div class="col">
                          <label for="productInputName">To</label>
                          <select v-if="formAction === 'Create'" v-model="newBooking.to" class="form-control" id="productInputCode">
                            <option value="Furmanov">Корпус на Фурманова</option>
                            <option value="Pushkin">Корпус на Пушкина</option>
                          </select>

                          <select v-else v-model="selectedBooking.to" class="form-control" id="productInputCode">
                            <option value="Furmanov">Корпус на Фурманова</option>
                            <option value="Pushkin">Корпус на Пушкина</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <hr>

                    <div class="form-group">
                      <div v-if="formAction === 'Create'" class="row">
                        <div class="col">
                          <v-date-picker v-model="newBooking.start_time" mode="dateTime" :timezone="timezone" is24hr>
                            <template v-slot="{ inputValue, inputEvents }">
                              <input placeholder="Start Time:"
                                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                                :value="inputValue"
                                v-on="inputEvents"
                              />
                            </template>
                          </v-date-picker>
                        </div>
                        <div class="col">
                          <input placeholder="Expected Time (Hours)" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.expected_duration">
                        </div>
                      </div>

                      <div v-if="formAction === 'Update'" class="row">
                        <div class="col">
                          <v-date-picker v-model="selectedBooking.start_time" mode="dateTime" :timezone="timezone" is24hr>
                            <template v-slot="{ inputValue, inputEvents }">
                              <input placeholder="Start Time:"
                                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                                :value="inputValue"
                                v-on="inputEvents"
                              />
                            </template>
                          </v-date-picker>
                        </div>
                        <div class="col">
                          <v-date-picker v-model="selectedBooking.end_time" mode="dateTime" :timezone="timezone" is24hr>
                            <template v-slot="{ inputValue, inputEvents }">
                              <input placeholder="End Time:"
                                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                                :value="inputValue"
                                v-on="inputEvents"
                              />
                            </template>
                          </v-date-picker>
                        </div>
                      </div>
                      <div v-if="formAction === 'Update'" class="row">
                        <div class="col">
                          <input placeholder="Expected Time (Hours)" type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.expected_duration">
                        </div>
                      </div>
                    </div>

                    <hr>

                    <div class="form-group">
                      <div class="row">
                        <div class="col">
                          <input placeholder="Email" v-if="formAction === 'Create'" type="text" class="form-control" v-model="newBooking.email">
                          <input placeholder="Email" v-else type="text" class="form-control" v-model="selectedBooking.email" value="selectedBooking.email">
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <input placeholder="First Name"v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.first_name">
                          <input placeholder="First Name" v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.first_name" value="selectedBooking.first_name">
                        </div>
                        <div class="col">
                          <input placeholder="Last Name" v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.last_name">
                          <input placeholder="Last Name" v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.last_name" value="selectedBooking.last_name">
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <input placeholder="Department" v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.department">
                          <input placeholder="Department" v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.department" value="selectedBooking.department">
                        </div>
                        <div class="col">
                          <input placeholder="Role" v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.role">
                          <input placeholder="Role" v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.role" value="selectedBooking.role">
                        </div>
                      </div>
                    </div>

                    <hr>

                    <div v-if="formAction === 'Create'" class="form-group">
                      <div class="row">
                        <div class="col">
                          <Dropdown
                            :options="assets"
                            type="number"
                            v-on:selected="selectAsset"
                            v-on:filter=""
                            :disabled="false"
                            :maxItem="10"
                            placeholder="Asset Name">
                          </Dropdown>
                        </div>
                        <div class="col">
                          <input placeholder= "Count" v-if="formAction === 'Create'" class="form-control" v-model="assetCount" type="number">
                          <input placeholder= "Count" v-else class="form-control" v-model="assetCount" value="assetCount" type="number">
                        </div>
                        <div class="col">
                          <button v-if="formAction === 'Create'" type="button" class="btn green_button" v-on:click="addAssetToList()">Add</button>
                        </div>
                      </div>

                      <div class="row">
                        <!-- Asset Table -->
                        <div class="table-responsive">
                          <table class="table table-sm table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Count</th>
                                <th>Del</th>
                              </tr>
                            </thead>
                  
                            <tbody>
                              <tr v-for="(value, key) in assetsList">
                                <td>{{ key }}</td>
                                <td v-for="asset in assets" v-if="asset.id == key">{{asset.name}}</td>
                                <td>{{ value }}</td> 
                  
                                <td>
                                  <button v-bind:value="key" v-on:click="deleteAssetFromList($event, key)" type="button" class="btn red_button">X</button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col">
                          <input placeholder="Description" v-if="formAction === 'Create'" type="text" class="form-control" v-model="newBooking.description">
                          <input placeholder="Description" v-else type="text" class="form-control" v-model="selectedBooking.description" value="selectedBooking.description">
                        </div>
                      </div>

                    </div>

                  </div>

                  <div class="modal-footer">
                    <button type="button" class="btn red_button" v-on:click="showPostModal = false">Close</button>
                    <button v-if="formAction === 'Create'" type="button" class="btn yellow_button" @click.prevent="createBooking()">{{ formAction }}</button>
                    <button v-else type="button" class="btn green_button" v-bind:value="selectedBooking.id" @click.prevent="updateBookingById">{{ formAction }}</button>
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
                    <h5 class="modal-title">Booking View</h5>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col">
                        <p>Booking Id: <span>{{ selectedBooking.id }}</span></p>
                      </div>
                      <div class="col">
                        <p v-if="selectedBooking.status === 'created'">Status: <span class="success_text">Создан</span></p>
                        <p v-if="selectedBooking.status === 'prepare'">Status: <span class="warning_text">В подготовке</span></p>
                        <p v-if="selectedBooking.status === 'process'">Status: <span class="warning_text">В пути</span></p>
                        <p v-if="selectedBooking.status === 'delivered'">Status: <span class="success_text">Доставлен</span></p>
                        <p v-if="selectedBooking.status === 'canceled'">Status: <span class="error_text">Отменен</span></p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <p>From: <span>{{ selectedBooking.from }}</span></p>
                      </div>
                      <div class="col">
                        <p>To: <span>{{ selectedBooking.to }}</span></p>
                      </div>
                    </div>

                    <hr>

                    <div class="row">
                      <div class="col">
                        <p>Feedback: <span>{{ rating.feedback }}</span></p>
                        <p>Rating: <span>{{ rating.star_rating }}</span></p>
                      </div>
                    </div>

                    <hr>

                    <div class="row">
                      <div class="col">
                        <p>Start Time: <span>{{ parseDateTime(selectedBooking.start_time) }}</span></p>
                      </div>
                      <div class="col">
                        <p>End Time: <span>{{ parseDateTime(selectedBooking.end_time) }}</span></p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <p>Expected Duration: <span>{{ selectedBooking.expected_duration }}</span></p>
                      </div>
                      <div class="col">
                        <p>Actual Duration: <span>{{ selectedBooking.actual_duration }}</span></p>
                      </div>
                    </div>

                    <hr>
                    
                    <div class="row">
                      <div class="col">
                        <p>Email: <span>{{ selectedBooking.email }}</span></p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <p>First Name: <span>{{ selectedBooking.first_name }}</span></p>
                      </div>
                      <div class="col">
                        <p>Last Name: <span>{{ selectedBooking.last_name }}</span></p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <p>Department: <span>{{ selectedBooking.department }}</span></p>
                      </div>
                      <div class="col">
                        <p>Role: <span>{{ selectedBooking.role }}</span></p>
                      </div>
                    </div>

                    <!-- Asset Table -->
                    <div class="table-responsive">
                      <table class="table table-sm table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Count</th>
                          </tr>
                        </thead>
              
                        <tbody>
                          <tr v-for="assetItem in orderAssetList">
                            <td>{{assetItem.id}}</td>
                            <td v-for="asset in assets" v-if="asset.id == assetItem.asset_id">{{asset.name}}</td>
                            <td>{{ assetItem.count }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div class="row">
                      <div class="col">
                        <p>{{ selectedBooking.description }}</p>
                      </div>
                    </div>

                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn red_button" v-on:click="showGetModal = false">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>



        <transition name="modal" v-if="showRatingModal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Booking Rating</h5>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col">
                        <textarea placeholder="Коментарий" type="text" class="form-control" v-model="rating.feedback"></textarea>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <star-rating v-model="rating.star_rating"></star-rating>
                      </div>
                    </div>

                  </div>

                  <div class="modal-footer">
                    <button type="button" class="btn red_button" v-on:click="showRatingModal = false">Close</button>
                    <button type="button" class="btn green_button" @click.prevent="sendFeedback()">Send</button>
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
