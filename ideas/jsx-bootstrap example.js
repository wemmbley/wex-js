class BootstrapButton extends Component {
    render() {
        return <a role="button" className='btn' {...$props}>
            {$props.innerHTML}
        </a>
    }
}

class BootstrapModal extends Component {
    render() {
        return <div className="modal hide fade">
            <div className="modal-header">
                <button
                    type="button"
                    className="close"
                    onClick={$component.cancel()}
                />
                <h3>{$props.title}</h3>
            </div>
            <div className="modal-body">
                {$props.innerHTML}
            </div>
            <div className="modal-footer">
                <if {$props.cancel}>
                    <BootstrapButton onClick={$component.cancel()}>
                        {$props.cancel}
                    </BootstrapButton>
                </if>
                <if {$props.confirm}>
                    <BootstrapButton
                        onClick={$component.confirm()}
                        class="btn-primary">
                        {$props.confirm}
                    </BootstrapButton>
                </if>
            </div>
        </div>
    }

    events($component) {
        function cancel($component) {
            if ($component.props.onCancel) {
                $component.props.onCancel()
            }

            $component.close();
        }

        function confirm($component) {
            if ($component.props.onConfirm) {
                $component.props.onConfirm()
            }

            $component.close();
        }

        function close($component) {
            if ($component.props.onClose) {
                $component.props.onClose()
            }
        }
    }
}

class MyTestModel extends Component {
    state = {
        modalVisible: false
    };

    events($component) {
        function toggleModal($component) {
            $component.state.modalVisible = !$component.state.modalVisible
        }

        function handleCancel($component) {
            if (confirm('Are you sure you want to cancel?')) {
                $component.toggleModal();
            }
        }
    }

    render() {
        return <div className="example">
            <if {$component.state.modalVisible}>
                <BootstrapModal
                    confirm="OK"
                    cancel="Cancel"
                    onCancel={$component.handleCancel()}
                    onConfirm={$component.toggleModal()}
                    title="Hello, Bootstrap!"
                >
                    This is a Jex component powered by jQuery and Bootstrap!
                </BootstrapModal>
            </if>
            <BootstrapButton onClick={$component.toggleModal()}>
                Toggle modal
            </BootstrapButton>
        </div>
    }
}

Jex.components([
    <BootstrapButton />,
    <BootstrapModal />,
    <MyTestModel/>,
]);