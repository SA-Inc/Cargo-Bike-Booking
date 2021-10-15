const CreateAndViewBooking = {
  data () {
    return {
      loading: true,
      showSuccessText: false,
      showErrorText: false,
      showWarningText: false,
      showPostModal: false,
      showRatingModal: false,
      getStatus: 'loading',
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
          console.log(this.assetsList)
          console.log(response);

          this.showPostModal = false;
          this.showActionText('success');
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getBookingById: function(data) {
      const url = `/api/check_order/${this.selectedBooking.id}/${this.selectedBooking.email}`;

      this.loading = true;

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

          this.loading = false;

          if (response.status == 200) {
            this.getStatus = 'found';
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 404 || error.response.status == 400) {
            this.getStatus = 'not_found';
          }
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
        })
        .catch((error) => {
          console.log(error);
        });
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
    this.getAllAssets();
  },

  template: `
  <div class="container">
    <div class="row">
      <h1>
        <span>Бронирование поездки</span>
        <button v-on:click="showPostModal = true;" type="button" class="btn yellow_button">Создать</button>
      </h1>
    </div>

    <div class="row">
      <div class="col">
        <input placeholder="Email" type="text" class="form-control" v-model="selectedBooking.email">
      </div>
      <div class="col">
        <input placeholder="ID поездки" type="text" class="form-control" v-model="selectedBooking.id">
      </div>
      <div class="col">
        <button type="button" class="btn green_button" v-on:click="getBookingById()">Проверить</button>
      </div>
    </div>

    <div v-if="getStatus == 'found'">
      <div class="row">
        <div class="col">
          <p>ID поездки: <span>{{ selectedBooking.id }}</span></p>
        </div>
        <div class="col">
          <p v-if="selectedBooking.status === 'created'">Статус: <span class="success_text">Создан</span></p>
          <p v-if="selectedBooking.status === 'prepare'">Статус: <span class="warning_text">В подготовке</span></p>
          <p v-if="selectedBooking.status === 'process'">Статус: <span class="warning_text">В пути</span></p>
          <p v-if="selectedBooking.status === 'delivered'">Статус: <span class="success_text">Доставлен</span></p>
          <p v-if="selectedBooking.status === 'canceled'">Статус: <span class="error_text">Отменен</span></p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p>Из: <span>{{ selectedBooking.from }}</span></p>
        </div>
        <div class="col">
          <p>В: <span>{{ selectedBooking.to }}</span></p>
        </div>
      </div>

      <div v-if="selectedBooking.status === 'delivered'">
        <div class="row">
          <div class="col">
            <button v-bind:value="selectedBooking.id" v-on:click="showRatingModal = true; rating.id = selectedBooking.id;" type="button" class="btn yellow_button">Оценить</button>
          </div>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="col">
          <p>Начало поездки: <span>{{ parseDateTime(selectedBooking.start_time) }}</span></p>
        </div>
        <div class="col">
          <p>Конец поездки: <span>{{ parseDateTime(selectedBooking.end_time) }}</span></p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p>Ожидаемое время в часах: <span>{{ selectedBooking.expected_duration }}</span></p>
        </div>
        <div class="col">
          <p>Фактическое время в часах: <span>{{ selectedBooking.actual_duration }}</span></p>
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
          <p>Имя: <span>{{ selectedBooking.first_name }}</span></p>
        </div>
        <div class="col">
          <p>Фамилия: <span>{{ selectedBooking.last_name }}</span></p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p>Дивизион: <span>{{ selectedBooking.department }}</span></p>
        </div>
        <div class="col">
          <p>Должность: <span>{{ selectedBooking.role }}</span></p>
        </div>
      </div>

      <!-- Asset Table -->
      <div class="table-responsive">
        <table class="table table-sm table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Количество</th>
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
          <p>Примечание:</p>
          <p>{{ selectedBooking.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="getStatus == 'not_found'">
      <h1 class="error_text">Заявка по Email или ID не найдена</h1>
    </div>

    <transition name="modal" v-if="showPostModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
            
              <div class="modal-header">
                <h5 class="modal-title">Создать поездку</h5>
              </div>

              <div class="modal-body">
                <div class="form-group">
                  <div class="row">
                    <div class="col">
                      <label>Из</label>
                      <select v-model="newBooking.from" class="form-control">
                        <option value="Furmanov">Корпус на Фурманова</option>
                        <option value="Pushkin">Корпус на Пушкина</option>
                      </select>
                    </div>
                    <div class="col">
                      <label>В</label>
                      <select v-model="newBooking.to" class="form-control">
                        <option value="Furmanov">Корпус на Фурманова</option>
                        <option value="Pushkin">Корпус на Пушкина</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr>

                <div class="form-group">
                  <div class="row">
                    <div class="col">
                      <v-date-picker v-model="newBooking.start_time" mode="dateTime" :timezone="timezone" is24hr>
                        <template v-slot="{ inputValue, inputEvents }">
                          <input placeholder="Начало поездки:"
                            class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                            :value="inputValue"
                            v-on="inputEvents"
                          />
                        </template>
                      </v-date-picker>
                    </div>
                    <div class="col">
                      <input placeholder="Ожидаемое время в часах" type="text" class="form-control" v-model="newBooking.expected_duration">
                    </div>
                  </div>
                </div>

                <hr>

                <div class="form-group">
                  <div class="row">
                    <div class="col">
                      <input placeholder="Email" type="text" class="form-control" v-model="newBooking.email">
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <input placeholder="Имя" type="text" class="form-control" v-model="newBooking.first_name">
                    </div>
                    <div class="col">
                      <input placeholder="Фамилия" type="text" class="form-control" v-model="newBooking.last_name">
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <input placeholder="Дивизион" type="text" class="form-control" v-model="newBooking.department">
                    </div>
                    <div class="col">
                      <input placeholder="Должность" type="text" class="form-control" v-model="newBooking.role">
                    </div>
                  </div>
                </div>

                <hr>

                <div class="form-group">
                  <div class="row">
                    <div class="col">
                      <select class="form-control" v-model="assetId">
                        <option v-for="asset in assets" v-bind:value="asset.id">{{asset.name}}</option>
                      </select>
                    </div>

                    <div class="col">
                      <input placeholder= "Количество" class="form-control" v-model="assetCount" type="number">
                    </div>
                    <div class="col">
                      <button type="button" class="btn green_button" v-on:click="addAssetToList()">+</button>
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
                </div>

                <div class="row">
                  <div class="col">
                    <input placeholder="Примечание" type="text" class="form-control" v-model="newBooking.description">
                  </div>
                </div>

              </div>

              <div class="modal-footer">
                <button type="button" class="btn red_button" v-on:click="showPostModal = false">Закрыть</button>
                <button type="button" class="btn yellow_button" @click.prevent="createBooking()">Создать</button>
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
                <h5 class="modal-title">Рейтинг поездки</h5>
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
                <button type="button" class="btn red_button" v-on:click="showRatingModal = false">Закрыть</button>
                <button type="button" class="btn green_button" @click.prevent="sendFeedback()">Отправить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
  `
}
