FROM nginx:1.27-alpine

LABEL maintainer="Tecnics Platform Team admin@tecnics-internal.online"
LABEL app="mm-smart-attendance"
LABEL version="1.0.1"

# Remove default nginx assets
RUN rm -rf /usr/share/nginx/html/*

# Copy production Nginx server configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy MM Smart Attendance static web assets
COPY src/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
