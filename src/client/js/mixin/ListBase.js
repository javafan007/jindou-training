

export default {
    data () {
        return {
            mixin_service: null,
            mixin_list: []
        };
    },

    methods: {
        doDelete (id) {
            this.mixin_service.deleteById(id)
                .then( res => this._loadList() );
        },


    }
}