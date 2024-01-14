import { ValidationError, useForm } from '@formspree/react';
import { Button, TextInput } from 'react95';
import { FlexRow } from 'renderer/sdk/FlexElements';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';
import Label from 'renderer/sdk/Label';

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
};

export const ContactDialog = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;

  const [state, handleSubmit] = useForm('xkndnwwp');

  return (
    <FlexWindowModal
      title={'Contact'}
      height={450}
      width={500}
      isOpen={isOpen}
      onClose={closeThisWindow}
      provideCloseButton
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            height: 'unset',
            width: 'unset',
            display: 'flex',
            flexDirection: 'column',
            margin: 25,
          }}
        >
          <Label htmlFor="email">Email</Label>
          <TextInput
            placeholder="something@somewhere.[com|etc]"
            id="email"
            type="email"
            name="email"
            required
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
          <div>
            <Label htmlFor="message">Message</Label>
            <TextInput
              multiline
              placeholder="Anything you type in this box I will read"
              id="message"
              name="message"
              style={{ width: '100%', height: '13rem' }}
              required
            />
          </div>
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />
          <FlexRow style={{ marginTop: 10 }}>
            {state.succeeded && 'Receieved ✔️'}
            {state.submitting && 'Submitting... ⌛'}
            {!state.succeeded && !state.submitting && (
              <Button type="submit" disabled={state.submitting}>
                Send
              </Button>
            )}
          </FlexRow>
        </form>
      </div>
    </FlexWindowModal>
  );
};
