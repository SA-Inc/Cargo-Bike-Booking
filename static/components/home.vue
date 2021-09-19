const Home  = {
  data () {
    return {
      bookings: [],
      calendar_data: [],
    }
  },
  methods: {
    getStatusColor: function(status) {
      if(status == 'created') return 'green';
      if(status == 'prepare') return 'yellow';
      if(status == 'process') return 'blue';
      if(status == 'delivered') return 'green';
      if(status == 'canceled') return 'red';
    },

    prepareCalendarData: function(dates) {
      this.calendar_data = [];
      for (let date of dates) {
        this.calendar_data.push(
          {
            dot: this.getStatusColor(date.status),
            dates: date.start_time,
            popover: {
              label: `${date.first_name} ${date.last_name} - ${date.description}`,
              visibility: 'click'
            },
            customData: {
              status: date.status,
              from: date.from,
              to: date.to,
              description: date.description,
              first_name: date.first_name,
              last_name: date.last_name,
              department: date.department,
              role: date.role
            },
          }
        );
      }

      console.log(this.calendar_data)
    },

    getAllBookings: function() {
      const url = '/api/order'

      axios.get(url)
        .then(response => {
          if (Array.isArray(response.data)) {
            console.log('array');
            this.bookings = response.data;
          } else {
            console.log('object');
            this.bookings = [response.data];
          }

          this.prepareCalendarData(this.bookings);
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
        this.prepareCalendarData(this.bookings);
      })
  },
  template: `
    <div class="container">
      <div class="header">
        <div class="row">
          <h1>
            <span>Главная страница</span>
            <button v-on:click="getAllBookings" type="button" class="btn purple_button">Обновить</button>
          </h1>
        </div>
        <h2>Всего бронирований: <span class="cherry_color">{{ bookings.length }}</span></h2>
        <v-calendar is-expanded show-weeknumbers :attributes='calendar_data'/>
      </div>
    </div>
  `
}
