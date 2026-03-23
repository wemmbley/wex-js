export class VMLocalStorage {
    static getKey = (key) => 'JQVM_ls_' + key;

    static getVal = (key) => {
        return JSON.parse(
            localStorage.getItem(
                this.getKey(
                    key
                )
            )
        )
    };

    static setVal = (key, val) => {
        val = String(val);

        localStorage.setItem(
            this.getKey(
                key
            ),
            JSON.stringify(
                val
            )
        )
    }

    static reloadJqvmLocalStorage = (state, status) => {

        // user handed some data into storage key
        if(state.storage !== undefined) {
            // get data from const storage
            const stateStorage = Object.assign({}, state.storage);

            Object.keys(stateStorage).forEach((name, index) => {
                const localStorageValue = this.getVal(name);

                // set state from storage if exists and it mount step (pipe)
                if(status === '$mount') {
                    this.setVal(state.storage[name])

                    const localStoreVal = this.getVal(name);

                    if(localStoreVal === null || localStoreVal === undefined) {
                        this.setVal(name, String(state.storage[name]));
                    } else {
                        state.storage[name] = localStoreVal;
                    }
                }

                // local storage empty
                if(localStorageValue === null) {
                    this.setVal(name, stateStorage[index]);

                    // storage have items, load it
                } else {
                    if(status === '$change') {
                        this.setVal(
                            name, state.storage[name]
                        );
                    }
                }
            })
        }
    };
}