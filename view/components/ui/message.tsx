import { toast } from 'sonner';

const message = {
  success: (msg: string) =>
    toast.success(msg, {
      style: {
        color: 'var(--success-600)'
      }
    }),
  info: (msg: string) =>
    toast.info(msg, {
      style: {
        color: 'var(--info-600)'
      }
    }),
  error: (msg: string) =>
    toast.error(msg, {
      style: {
        color: 'var(--error-600)'
      }
    })
};

export default message;
