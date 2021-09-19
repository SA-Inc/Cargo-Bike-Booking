const Booking  = {
  data () {
    return {
      loading: true,
      showSuccessText: false,
      showErrorText: false,
      showWarningText: false,
      bookings: [],
      showGetModal: false,
      showPostModal: false,
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
        first_name: null,
        last_name: null,
        department: null,
        role: null
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

    createBooking: function() {
      const url = '/api/order';

      this.newBooking.expected_duration = Number(this.newBooking.expected_duration)
      // this.newBooking.start_time = new Date(this.newBooking.start_time).toISOString()

      console.log(this.newBooking)

      axios.post(url, this.newBooking)
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
          this.selectedBooking.id = response.data.id;
          this.selectedBooking.from = response.data.from;
          this.selectedBooking.to = response.data.to;
          this.selectedBooking.start_time = response.data.start_time;
          this.selectedBooking.end_time = response.data.end_time;
          this.selectedBooking.expected_duration = response.data.expected_duration;
          this.selectedBooking.actual_duration = response.data.actual_duration;
          this.selectedBooking.status = response.data.status;
          this.selectedBooking.description = response.data.description;
          this.selectedBooking.first_name = response.data.first_name;
          this.selectedBooking.last_name = response.data.last_name;
          this.selectedBooking.department = response.data.department;
          this.selectedBooking.role = response.data.role;

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
          this.selectedBooking.id = response.data.id;
          this.selectedBooking.from = response.data.from;
          this.selectedBooking.to = response.data.to;
          this.selectedBooking.start_time = response.data.start_time;
          this.selectedBooking.end_time = response.data.end_time;
          this.selectedBooking.expected_duration = response.data.expected_duration;
          this.selectedBooking.actual_duration = response.data.actual_duration;
          this.selectedBooking.status = response.data.status;
          this.selectedBooking.description = response.data.description;
          this.selectedBooking.first_name = response.data.first_name;
          this.selectedBooking.last_name = response.data.last_name;
          this.selectedBooking.department = response.data.department;
          this.selectedBooking.role = response.data.role;

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

  },
  mounted() {
    axios.get(`/api/order`)
      .then(response => {
        if (Array.isArray(response.data)) {
          console.log('array');
          this.bookings = response.data;
        } else {
          console.log('object');
          this.bookings = [response.data];
        }

        console.log(this.bookings);
        this.loading = false;
      })
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
                          <label for="meeting-time">Start Time:</label>
                          <v-date-picker v-model="newBooking.start_time" mode="dateTime" :timezone="timezone" is24hr>
                            <template v-slot="{ inputValue, inputEvents }">
                              <input
                                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                                :value="inputValue"
                                v-on="inputEvents"
                              />
                            </template>
                          </v-date-picker>
                        </div>
                        <div class="col">
                          <label for="productInputDescription">Expected Time (Hours)</label>
                          <input type="text" class="form-control" id="productInputProductValue" v-model="newBooking.expected_duration">
                        </div>
                      </div>

                      <div v-if="formAction === 'Update'" class="row">
                        <div class="col">
                          <label for="meeting-time">Start Time:</label>
                          <v-date-picker v-model="selectedBooking.start_time" mode="dateTime" :timezone="timezone" is24hr>
                            <template v-slot="{ inputValue, inputEvents }">
                              <input
                                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                                :value="inputValue"
                                v-on="inputEvents"
                              />
                            </template>
                          </v-date-picker>
                        </div>
                        <div class="col">
                          <label for="meeting-time">End Time:</label>
                          <v-date-picker v-model="selectedBooking.end_time" mode="dateTime" :timezone="timezone" is24hr>
                            <template v-slot="{ inputValue, inputEvents }">
                              <input
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
                          <label for="productInputDescription">Expected Time (Hours)</label>
                          <input type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.expected_duration">
                        </div>
                      </div>
                    </div>

                    <hr>

                    <div class="form-group">
                      <div class="row">
                        <div class="col">
                          <label for="productInputDescription">First Name</label>
                          <input v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.first_name">
                          <input v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.first_name" value="selectedBooking.first_name">
                        </div>
                        <div class="col">
                          <label for="productInputDescription">Last Name</label>
                          <input v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.last_name">
                          <input v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.last_name" value="selectedBooking.last_name">
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <label for="productInputDescription">Department</label>
                          <input v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.department">
                          <input v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.department" value="selectedBooking.department">
                        </div>
                        <div class="col">
                          <label for="productInputDescription">Role</label>
                          <input v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.role">
                          <input v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.role" value="selectedBooking.role">
                        </div>
                      </div>
                    </div>

                    <hr>

                    <div class="form-group">
                      <label for="productInputDescription">Description</label>
                      <input v-if="formAction === 'Create'" type="text" class="form-control" id="productInputProductValue" v-model="newBooking.description">
                      <input v-else type="text" class="form-control" id="productInputProductValue" v-model="selectedBooking.description" value="selectedBooking.description">
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
                    <h5 class="modal-title">Product View</h5>
                  </div>
                  <div class="modal-body">
                    <p>Booking Id: <span>{{ selectedBooking.id }}</span></p>
                    
                    <p v-if="selectedBooking.status === 'created'">Status: <span class="success_text">Создан</span></p>
                    <p v-if="selectedBooking.status === 'prepare'">Status: <span class="warning_text">В подготовке</span></p>
                    <p v-if="selectedBooking.status === 'process'">Status: <span class="warning_text">В пути</span></p>
                    <p v-if="selectedBooking.status === 'delivered'">Status: <span class="success_text">Доставлен</span></p>
                    <p v-if="selectedBooking.status === 'canceled'">Status: <span class="error_text">Отменен</span></p>
                    
                    <p>From: <span>{{ selectedBooking.from }}</span></p>
                    <p>To: <span>{{ selectedBooking.to }}</span></p>
                    <p>Start Time: <span>{{ parseDateTime(selectedBooking.start_time) }}</span></p>
                    <p>End Time: <span>{{ parseDateTime(selectedBooking.end_time) }}</span></p>
                    <p>Expected Duration: <span>{{ selectedBooking.expected_duration }}</span></p>
                    <p>Actual Duration: <span>{{ selectedBooking.actual_duration }}</span></p>
                    <p>Description: <span>{{ selectedBooking.description }}</span></p>
                    <p>First Name: <span>{{ selectedBooking.first_name }}</span></p>
                    <p>Last Name: <span>{{ selectedBooking.last_name }}</span></p>
                    <p>Department: <span>{{ selectedBooking.department }}</span></p>
                    <p>Role: <span>{{ selectedBooking.role }}</span></p>
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
