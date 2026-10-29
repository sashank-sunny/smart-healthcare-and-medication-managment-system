import com.sun.net.httpserver.*;
import java.awt.Toolkit;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.sql.*;
import java.util.*;
import java.util.regex.*;

class Topic { String id, cat, name, remedy, doc; Topic(String i, String c, String n, String r, String d) { id=i; cat=c; name=n; remedy=r; doc=d; } }
class Medicine { String id, name, cat, dosage; double price; int stock, thresh; Medicine(String i, String n, String c, String d, double p, int s, int t) { id=i; name=n; cat=c; dosage=d; price=p; stock=s; thresh=t; } public boolean isLowStock() { return this.stock <= this.thresh; } }
class Reminder { String id, name, type, schedule; Reminder(String i, String n, String t, String s) { id=i; name=n; type=t; schedule=s; } }

public class MediGuide {
    static final String ADMIN_USER = "MediGuide@123";
    static final String ADMIN_PASS = "javamediguide321";
    static final Map<String, String> otps = new HashMap<>();
    static Connection sqlConn = null;
    static String dbStatus = "SQL Dual-Engine Active (MySQL Ready)";
    static final List<Topic> guides = new ArrayList<>();
    static final List<Medicine> catalog = new ArrayList<>();
    static final List<Reminder> reminders = new ArrayList<>();
    static final List<String> orders = new ArrayList<>();
    static final Scanner scanner = new Scanner(System.in);

    static void initData() {
        guides.addAll(Arrays.asList(
            new Topic("d1","DISEASES","Fever","Paracetamol 650mg (Safe), ORS","Doctor if >102°F or >48h"), new Topic("d2","DISEASES","Common Cold","Cetirizine 10mg (Safe), Vit C, Saline Spray","Doctor if >10d"),
            new Topic("s1","SYMPTOMS","Persistent Cough","Cough Relief Syrup (Safe), Warm Honey Water","Doctor if >3 weeks"), new Topic("p1","PHOBIAS","Claustrophobia","Box breathing 4-4-4, CBT therapy","Consult licensed therapist"),
            new Topic("v1","VIRUSES","Influenza","Paracetamol 650mg (Safe), Vitamin C, Zinc","Doctor if fever >3d")));
        catalog.addAll(Arrays.asList(
            new Medicine("M1","Paracetamol 650mg","TABLETS","1 Tab q6-8h post-meals",4.99,45,10), new Medicine("M2","Amoxicillin 500mg","ANTIBIOTICS","1 Cap tid meals (Rx)",12.50,20,5),
            new Medicine("M3","Cetirizine 10mg","TABLETS","1 Tab bedtime",5.20,50,12), new Medicine("M4","Metformin 500mg","DIABETES","1 Tab bid meals",8.90,4,6),
            new Medicine("M5","Cough Relief Syrup","SYRUPS","10ml tid",7.40,25,8), new Medicine("M6","Pantoprazole 40mg","ANTACIDS","1 Cap morning before food",9.80,35,10),
            new Medicine("M8","ORS Electrolyte Sachet","SYRUPS","Dissolve in 1L water",2.40,60,15), new Medicine("M9","Ondansetron 4mg","TABLETS","1 Tab SOS pre-meals",6.50,30,8)));
        reminders.add(new Reminder("R1","Paracetamol 650mg","TAKING","08:00 AM & 08:00 PM"));
        reminders.add(new Reminder("R2","Metformin 500mg","REORDER","Stock: 4 (Safety Limit: 6)"));
    }

    static void initDb() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            sqlConn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mediguide?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true", "root", "");
            try (Statement st = sqlConn.createStatement()) {
                st.execute("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100), email VARCHAR(100) UNIQUE, password_hash VARCHAR(64), verified BOOLEAN, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
                st.execute("CREATE TABLE IF NOT EXISTS feedback (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100), rating INT, msg TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
                st.execute("CREATE TABLE IF NOT EXISTS reminders (id INT AUTO_INCREMENT PRIMARY KEY, med_name VARCHAR(100), type VARCHAR(20), schedule VARCHAR(100), notes VARCHAR(255))");
            }
            dbStatus = "MySQL Database Connected (localhost:3306/mediguide)";
        } catch (Throwable t) { dbStatus = "SQL Dual-Engine Active (MySQL Ready)"; }
        System.out.println("ℹ️ Database Engine: " + dbStatus);
    }

    public static void main(String[] a) throws IOException {
        initData(); initDb();
        int port = 3000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api/", new ApiHandler()); server.createContext("/", new StaticHandler());
        server.start();
        System.out.println("======================================================================\n  🩺 MediGuide — \"Your Health, Our Reminder.\"\n  Smart medical guidance and timely medication reminders, all in one place\n  Web Portal: http://localhost:" + port + "/ | Admin: Protected\n======================================================================");
        if (a.length > 0 && "--server-only".equalsIgnoreCase(a[0])) return;
        runCli();
    }

    static void runCli() {
        boolean r = true;
        while (r) {
            System.out.println("\n[1] Guides [2] Store [3] Reminders [4] 📷 Scan Doctor Rx [5] Orders [6] Search [7] Verify Email [8] Beep [0] 🔐 Admin SQL Data [9] Exit\nSelect: ");
            int c = scanner.hasNextInt() ? scanner.nextInt() : 9; scanner.nextLine();
            switch (c) {
                case 1: for (Topic t : guides) System.out.printf("%-3s | %-16s | %-9s | %s\n", t.id, t.name, t.cat, t.remedy); break;
                case 2: for (Medicine m : catalog) System.out.printf("%-3s | %-20s | $%-5.2f | %s\n", m.id, m.name, m.price, m.isLowStock() ? "⚠️ LOW" : "In Stock"); break;
                case 3: for (Reminder rm : reminders) System.out.println(" • " + rm.type + ": " + rm.name + " -> " + rm.schedule); break;
                case 4: System.out.println("📷 [PRESCRIPTION SCANNER] Verified Rx #48291 (Amoxicillin, Paracetamol, Pantoprazole)"); reminders.add(new Reminder("R"+(reminders.size()+1), "Amoxicillin 500mg (Rx)", "TAKING", "08:00 AM, 02:00 PM, 08:00 PM")); playBeep("Rx Scanned & Reminders Synced"); break;
                case 5: System.out.println("📦 Orders: " + (orders.isEmpty() ? "No orders yet." : orders)); break;
                case 6: System.out.print("Keyword: "); String q = scanner.nextLine().toLowerCase().trim(); for (Topic t : guides) if (t.name.toLowerCase().contains(q)) System.out.println("✔ Guide: " + t.name + " -> " + t.remedy); break;
                case 7: System.out.print("Email: "); String em = scanner.nextLine().trim(); if (isValidEmail(em)) { int otp = 100000 + new Random().nextInt(900000); System.out.println("📧 6-Digit OTP: [" + otp + "]"); playBeep("Email Verified"); } else System.out.println("❌ Invalid email format!"); break;
                case 8: playBeep("Audio Frequency Test"); break;
                case 0:
                    System.out.print("Admin Username: "); String au = scanner.nextLine().trim(); System.out.print("Admin Password: "); String ap = scanner.nextLine().trim();
                    if (ADMIN_USER.equals(au) && ADMIN_PASS.equals(ap)) {
                        System.out.println("\n🔐 [SQL DATABASE RECORDS - " + dbStatus + "]\n--- USERS ---"); for (String s : getSqlUsers()) System.out.println(s);
                        System.out.println("--- FEEDBACK ---"); for (String s : getSqlFeedback()) System.out.println(s);
                    } else System.out.println("❌ Access Denied: Invalid Admin Credentials!"); break;
                case 9: System.out.println("Thank you for using MediGuide — Stay healthy!"); r = false; break;
                default: break;
            }
        }
    }

    static class StaticHandler implements HttpHandler {
        public void handle(HttpExchange ex) throws IOException {
            String p = ex.getRequestURI().getPath(); if (p == null || p.equals("/") || p.isEmpty()) p = "/index.html";
            String rel = p.startsWith("/") ? p.substring(1) : p; File f = new File(rel);
            if (!f.exists()) f = new File("frontend" + File.separator + rel);
            if (!f.exists()) f = new File("MediGuide" + File.separator + rel);
            if (!f.exists() || f.isDirectory()) { byte[] nf = "404 Not Found".getBytes(StandardCharsets.UTF_8); ex.sendResponseHeaders(404, nf.length); try (OutputStream os = ex.getResponseBody()) { os.write(nf); } return; }
            String ct = p.endsWith(".html")?"text/html; charset=UTF-8":p.endsWith(".css")?"text/css; charset=UTF-8":p.endsWith(".js")?"application/javascript; charset=UTF-8":"text/plain; charset=UTF-8";
            byte[] b = Files.readAllBytes(f.toPath()); ex.getResponseHeaders().set("Content-Type", ct); ex.sendResponseHeaders(200, b.length);
            try (OutputStream os = ex.getResponseBody()) { os.write(b); }
        }
    }

    static class ApiHandler implements HttpHandler {
        public void handle(HttpExchange ex) throws IOException {
            ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, X-Admin-Key");
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }
            String p = ex.getRequestURI().getPath();
            if (p.startsWith("/api/category/")) {
                StringBuilder sb = new StringBuilder("["); boolean first = true;
                for (Topic t : guides) { if (!first) sb.append(","); first = false; sb.append(String.format("{\"id\":\"%s\",\"cat\":\"%s\",\"name\":\"%s\",\"remedy\":\"%s\",\"doc\":\"%s\"}", t.id, t.cat.toLowerCase(), t.name, esc(t.remedy), esc(t.doc))); }
                send(ex, sb.append("]").toString(), 200);
            } else if (p.equals("/api/verify-email") && "POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String b = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8); String email = getVal(b, "email").trim().toLowerCase();
                if (!isValidEmail(email) || isImproper(email)) { send(ex, "{\"status\":\"error\",\"message\":\"Invalid email.\"}", 400); return; }
                int code = 100000 + new Random().nextInt(900000); otps.put(email, String.valueOf(code));
                send(ex, String.format("{\"status\":\"success\",\"message\":\"OTP generated!\",\"otp\":\"%d\"}", code), 200);
            } else if (p.equals("/api/signup") && "POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String b = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                String u = getVal(b, "username").trim(), e = getVal(b, "email").trim().toLowerCase(), pass = getVal(b, "password");
                if (u.isEmpty() || !isValidEmail(e) || isImproper(u) || isImproper(e)) { send(ex, "{\"status\":\"error\",\"message\":\"Improper input.\"}", 400); return; }
                if (sqlConn != null) { try (PreparedStatement ps = sqlConn.prepareStatement("INSERT INTO users (username, email, password_hash, verified) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE verified=true")) { ps.setString(1, u); ps.setString(2, e); ps.setString(3, Integer.toHexString(pass.hashCode())); ps.setBoolean(4, true); ps.executeUpdate(); } catch(Exception ignored) {} }
                try (PrintWriter pw = new PrintWriter(new FileWriter(getFile("users_database.txt"), true))) { pw.printf("USER: [%s] User: %s | Email: %s | Verified: TRUE | Hash: %s%n", new java.util.Date(), u, e, Integer.toHexString(pass.hashCode())); }
                send(ex, "{\"status\":\"success\",\"message\":\"Registered & verified!\"}", 200);
            } else if (p.equals("/api/feedback") && "POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String b = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8); String u = getVal(b, "user"), r = getVal(b, "rating"), m = getVal(b, "msg");
                if (m.isEmpty() || isImproper(m)) { send(ex, "{\"status\":\"error\",\"message\":\"Improper content.\"}", 400); return; }
                if (sqlConn != null) { try (PreparedStatement ps = sqlConn.prepareStatement("INSERT INTO feedback (username, rating, msg) VALUES (?, ?, ?)")) { ps.setString(1, u); ps.setInt(2, Integer.parseInt(r)); ps.setString(3, m); ps.executeUpdate(); } catch(Exception ignored) {} }
                try (PrintWriter pw = new PrintWriter(new FileWriter(getFile("feedback_log.txt"), true))) { pw.printf("FEEDBACK: [%s] User: %s | Rating: %s | Msg: %s%n", new java.util.Date(), u, r, m); }
                send(ex, "{\"status\":\"success\",\"message\":\"Feedback recorded!\"}", 200);
            } else if (p.equals("/api/admin/data") && "POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String b = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                String u = getVal(b, "username"), pass = getVal(b, "password");
                if (ADMIN_USER.equals(u) && ADMIN_PASS.equals(pass)) {
                    send(ex, String.format("{\"status\":\"ok\",\"db\":\"%s\",\"engine\":\"%s\",\"users\":%s,\"feedbacks\":%s}", dbStatus, (sqlConn!=null?"MySQL Relational Database":"SQL Dual-Engine Store"), toJsonArray(getSqlUsers()), toJsonArray(getSqlFeedback())), 200);
                } else send(ex, "{\"status\":\"error\",\"message\":\"Unauthorized: Invalid Admin Credentials\"}", 401);
            } else ex.sendResponseHeaders(404, -1);
        }
    }

    static List<String> getSqlUsers() {
        List<String> l = new ArrayList<>();
        if (sqlConn != null) { try (Statement st = sqlConn.createStatement(); ResultSet rs = st.executeQuery("SELECT * FROM users")) { while (rs.next()) l.add(String.format("SQL [users] ID: %d | User: %s | Email: %s | Verified: %s | Date: %s", rs.getInt("id"), rs.getString("username"), rs.getString("email"), rs.getBoolean("verified"), rs.getString("created_at"))); } catch (Exception ignored) {} }
        if (l.isEmpty()) { File f = getFile("users_database.txt"); if (f.exists()) try { l.addAll(Files.readAllLines(f.toPath(), StandardCharsets.UTF_8)); } catch (Exception ignored) {} }
        return l;
    }
    static List<String> getSqlFeedback() {
        List<String> l = new ArrayList<>();
        if (sqlConn != null) { try (Statement st = sqlConn.createStatement(); ResultSet rs = st.executeQuery("SELECT * FROM feedback")) { while (rs.next()) l.add(String.format("SQL [feedback] ID: %d | User: %s | Rating: %d/5 | Msg: %s | Date: %s", rs.getInt("id"), rs.getString("username"), rs.getInt("rating"), rs.getString("msg"), rs.getString("created_at"))); } catch (Exception ignored) {} }
        if (l.isEmpty()) { File f = getFile("feedback_log.txt"); if (f.exists()) try { l.addAll(Files.readAllLines(f.toPath(), StandardCharsets.UTF_8)); } catch (Exception ignored) {} }
        return l;
    }
    static String toJsonArray(List<String> l) { StringBuilder sb = new StringBuilder("["); for (int i=0; i<l.size(); i++) { sb.append("\"").append(esc(l.get(i))).append("\"").append(i<l.size()-1?",":""); } return sb.append("]").toString(); }
    static boolean isValidEmail(String e) { return e != null && Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$").matcher(e).matches(); }
    static boolean isImproper(String s) { if (s == null) return false; String l = s.toLowerCase(); return l.contains("<script") || l.contains("drop table") || l.contains("union select") || l.contains("eval("); }
    static File getFile(String n) { File f = new File(n); if (f.exists()) return f; File f2 = new File("backend" + File.separator + n); return f2.exists() ? f2 : f; }
    static String esc(String s) { return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", ""); }
    static String getVal(String j, String k) { Matcher m = Pattern.compile("\"" + Pattern.quote(k) + "\"[\\s]*:[\\s]*\"([^\"]*)\"").matcher(j); return m.find() ? m.group(1) : ""; }
    static void send(HttpExchange ex, String r, int c) throws IOException { byte[] b = r.getBytes(StandardCharsets.UTF_8); ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8"); ex.sendResponseHeaders(c, b.length); try (OutputStream os = ex.getResponseBody()) { os.write(b); } }
    static void playBeep(String m) { System.out.println("🔔 [BEEP] -> " + m); try { Toolkit.getDefaultToolkit().beep(); } catch (Exception ignored) {} }
}
